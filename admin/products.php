
<?php
require __DIR__ . '/bootstrap.php';
admin();

/*
|--------------------------------------------------------------------------
| Product helpers
|--------------------------------------------------------------------------
*/

// Generate a unique product ID without changing the existing database schema.
function generateProductId(): string
{
    return 'prod_' . bin2hex(random_bytes(8));
}

// Generate a URL-friendly slug from a product title.
function generateSlug(string $title): string
{
    $slug = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $title);
    if ($slug === false) {
        $slug = $title;
    }

    $slug = strtolower($slug);
    $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
    $slug = trim($slug, '-');
    $slug = substr($slug, 0, 170);
    $slug = rtrim($slug, '-');

    return $slug !== '' ? $slug : 'product';
}

// Make sure two products never have the same slug.
function uniqueProductSlug(string $title, string $excludeId = ''): string
{
    $base = generateSlug($title);
    $slug = $base;
    $number = 2;

    $stmt = db()->prepare(
        'SELECT id FROM products WHERE slug = ? AND id <> ? LIMIT 1'
    );

    while (true) {
        $stmt->execute([$slug, $excludeId]);

        if (!$stmt->fetch()) {
            return $slug;
        }

        $slug = $base . '-' . $number;
        $number++;
    }
}

// Handle product image uploads.
function uploadProductImage(array $file): string
{
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        throw new RuntimeException('Image upload failed.');
    }

    if (
        !isset($file['tmp_name'], $file['size']) ||
        !is_uploaded_file($file['tmp_name'])
    ) {
        throw new RuntimeException('Invalid uploaded file.');
    }

    // Maximum image size: 5 MB
    if ($file['size'] <= 0 || $file['size'] > 5 * 1024 * 1024) {
        throw new RuntimeException('Image must be smaller than 5 MB.');
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file['tmp_name']);

    $allowed = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp'
    ];

    if (!isset($allowed[$mime])) {
        throw new RuntimeException(
            'Only JPG, PNG and WebP images are allowed.'
        );
    }

    // Verify the actual file is an image.
    if (@getimagesize($file['tmp_name']) === false) {
        throw new RuntimeException('Invalid image content.');
    }

    $uploadDir = __DIR__ . '/uploads/products/';

    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) {
            throw new RuntimeException(
                'Could not create product upload directory.'
            );
        }
    }

    // Prevent script execution in the upload directory on Apache.
    $htaccess = dirname($uploadDir) . '/.htaccess';
    if (!is_file($htaccess)) {
        @file_put_contents(
            $htaccess,
            "Options -Indexes\n<FilesMatch \"\\.(php|phtml|phar|cgi|pl)$\">\nRequire all denied\n</FilesMatch>\n"
        );
    }

    $filename = bin2hex(random_bytes(16)) . '.' . $allowed[$mime];

    $destination = $uploadDir . $filename;

    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        throw new RuntimeException('Unable to save uploaded image.');
    }

    return 'uploads/products/' . $filename;
}

/*
|--------------------------------------------------------------------------
| Handle POST requests
|--------------------------------------------------------------------------
*/

if (requestPost()) {
    failSafe(function () {

        $action = (string) ($_POST['action'] ?? '');

        /*
        |--------------------------------------------------------------
        | Create / Update Product
        |--------------------------------------------------------------
        */

        if ($action === 'save') {

            $id = trim((string) ($_POST['id'] ?? ''));

            $title = trim((string) ($_POST['title'] ?? ''));
            $category = trim((string) ($_POST['category'] ?? ''));
            $description = trim((string) ($_POST['description'] ?? ''));

            if ($title === '' || $category === '') {
                throw new RuntimeException(
                    'Product title and category are required.'
                );
            }

            $price = intPrice((string) ($_POST['price'] ?? ''));

            // Optional size batch: create/update variants with this product.
            $allowedSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];
            $postedSizes = $_POST['sizes'] ?? [];
            if (!is_array($postedSizes)) {
                throw new RuntimeException('Invalid sizes submitted.');
            }
            $selectedSizes = array_values(array_unique(array_map('strval', $postedSizes)));
            if (array_diff($selectedSizes, $allowedSizes)) {
                throw new RuntimeException('Invalid size selection.');
            }
            $variantColor = trim((string) ($_POST['variant_color'] ?? 'Black'));
            $variantGsm = trim((string) ($_POST['variant_gsm'] ?? '220'));
            if ($selectedSizes && ($variantColor === '' || strlen($variantColor) > 100 || strlen($variantGsm) > 50)) {
                throw new RuntimeException('Enter a valid color and GSM.');
            }
            $sizeStocks = $_POST['size_stock'] ?? [];
            if (!is_array($sizeStocks)) {
                throw new RuntimeException('Invalid stock data.');
            }
            $validatedStocks = [];
            foreach ($selectedSizes as $size) {
                $rawStock = $sizeStocks[$size] ?? null;
                $stock = filter_var($rawStock, FILTER_VALIDATE_INT);
                if ($stock === false || $stock < 0) {
                    throw new RuntimeException('Enter valid stock for size ' . $size);
                }
                $validatedStocks[$size] = $stock;
            }

            $active = isset($_POST['active']) ? 1 : 0;

            $existing = null;

            // Check whether we're editing an existing product.
            if ($id !== '') {

                $stmt = db()->prepare(
                    'SELECT * FROM products WHERE id = ? LIMIT 1'
                );

                $stmt->execute([$id]);
                $existing = $stmt->fetch();

                if (!$existing) {
                    throw new RuntimeException('Product not found.');
                }

            } else {

                // Automatically generate a product ID.
                do {
                    $id = generateProductId();

                    $stmt = db()->prepare(
                        'SELECT id FROM products WHERE id = ? LIMIT 1'
                    );

                    $stmt->execute([$id]);

                } while ($stmt->fetch());
            }

            // Automatically generate slug.
            $slug = uniqueProductSlug($title, $id);

            // Preserve existing image when editing.
            $image = $existing['image_url'] ?? '';

            $newUploadedPath = null;

            // Upload new image if selected.
            if (
                isset($_FILES['image']) &&
                ($_FILES['image']['error'] ?? UPLOAD_ERR_NO_FILE)
                    !== UPLOAD_ERR_NO_FILE
            ) {
                $newUploadedPath = uploadProductImage($_FILES['image']);
                $image = $newUploadedPath;
            }

            try {
                db()->beginTransaction();

                if ($existing) {

                    // Update existing product.
                    $stmt = db()->prepare(
                        'UPDATE products
                         SET slug = ?,
                             title = ?,
                             description = ?,
                             category = ?,
                             image_url = ?,
                             price_paise = ?,
                             active = ?
                         WHERE id = ?'
                    );

                    $stmt->execute([
                        $slug,
                        $title,
                        $description,
                        $category,
                        $image,
                        $price,
                        $active,
                        $id
                    ]);

                } else {

                    // Insert new product.
                    $stmt = db()->prepare(
                        'INSERT INTO products
                         (id, slug, title, description, category,
                          image_url, price_paise, active)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
                    );

                    $stmt->execute([
                        $id,
                        $slug,
                        $title,
                        $description,
                        $category,
                        $image,
                        $price,
                        $active
                    ]);
                }

                // Save selected size/color/GSM combinations. Existing variants
                // with other combinations remain unchanged.
                $findVariant = db()->prepare(
                    'SELECT id FROM product_variants
                     WHERE product_id = ? AND size = ? AND color = ? AND gsm = ?
                     LIMIT 1'
                );
                $updateVariant = db()->prepare(
                    'UPDATE product_variants SET price_paise = ?, stock = ? WHERE id = ?'
                );
                $insertVariant = db()->prepare(
                    'INSERT INTO product_variants
                     (product_id, size, color, gsm, price_paise, stock)
                     VALUES (?, ?, ?, ?, ?, ?)'
                );
                foreach ($validatedStocks as $size => $stock) {
                    $findVariant->execute([$id, $size, $variantColor, $variantGsm]);
                    $variantId = $findVariant->fetchColumn();
                    if ($variantId !== false) {
                        $updateVariant->execute([$price, $stock, $variantId]);
                    } else {
                        $insertVariant->execute([$id, $size, $variantColor, $variantGsm, $price, $stock]);
                    }
                }
                db()->commit();

            } catch (Throwable $error) {
                if (db()->inTransaction()) {
                    db()->rollBack();
                }

                // Remove newly uploaded image if database save failed.
                if ($newUploadedPath !== null) {
                    @unlink(__DIR__ . '/' . $newUploadedPath);
                }

                throw $error;
            }

            flash('Product saved successfully.');

            go('products.php?edit=' . urlencode($id));

        }

        /*
        |--------------------------------------------------------------
        | Toggle product visibility
        |--------------------------------------------------------------
        */

        elseif ($action === 'toggle') {

            $stmt = db()->prepare(
                'UPDATE products SET active = 1 - active WHERE id = ?'
            );

            $stmt->execute([
                (string) ($_POST['id'] ?? '')
            ]);

            flash('Product visibility updated.');
        }

        /*
        |--------------------------------------------------------------
        | Add / Update Variant
        |--------------------------------------------------------------
        */

        elseif ($action === 'variant') {

            $id = (string) ($_POST['product_id'] ?? '');

            $size = trim((string) ($_POST['size'] ?? ''));
            $color = trim((string) ($_POST['color'] ?? ''));
            $gsm = trim((string) ($_POST['gsm'] ?? ''));

            $stock = filter_var(
                $_POST['stock'] ?? null,
                FILTER_VALIDATE_INT
            );

            if (
                !$size ||
                !$color ||
                $stock === false ||
                $stock < 0
            ) {
                throw new RuntimeException('Invalid variant values.');
            }

            $price = intPrice((string) ($_POST['price'] ?? ''));

            $stmt = db()->prepare(
                'INSERT INTO product_variants
                 (product_id, size, color, gsm, price_paise, stock)
                 VALUES (?, ?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE
                    price_paise = VALUES(price_paise),
                    stock = VALUES(stock)'
            );

            $stmt->execute([
                $id,
                $size,
                $color,
                $gsm,
                $price,
                $stock
            ]);

            flash('Variant saved.');
        }

        /*
        |--------------------------------------------------------------
        | Remove Variant
        |--------------------------------------------------------------
        */

        elseif ($action === 'remove_variant') {

            $stmt = db()->prepare(
                'DELETE FROM product_variants WHERE id = ?'
            );

            $stmt->execute([
                (int) ($_POST['variant_id'] ?? 0)
            ]);

            flash('Variant deleted.');
        }

        go('products.php');
    });
}

/*
|--------------------------------------------------------------------------
| Fetch products
|--------------------------------------------------------------------------
*/

$products = db()
    ->query('SELECT * FROM products ORDER BY created_at DESC')
    ->fetchAll();

$selected = (string) ($_GET['edit'] ?? '');

$product = null;

foreach ($products as $p) {
    if ((string) $p['id'] === $selected) {
        $product = $p;
        break;
    }
}

/*
|--------------------------------------------------------------------------
| Fetch variants for selected product
|--------------------------------------------------------------------------
*/

$variants = [];

if ($product) {

    $stmt = db()->prepare(
        'SELECT * FROM product_variants
         WHERE product_id = ?
         ORDER BY id DESC'
    );

    $stmt->execute([$selected]);

    $variants = $stmt->fetchAll();
}

layout('Products', 'products.php');
?>

<div class="two">

    <!-- PRODUCT CATALOG -->

    <section class="panel">

        <div class="panelhead">

            <h2>Catalog</h2>

            <a class="btn ghost" href="products.php">
                New product
            </a>

        </div>

        <div class="tablewrap">

            <table>

                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Visibility</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>

                    <?php foreach ($products as $p): ?>

                        <tr>

                            <td>

                                <strong>
                                    <?= e($p['title']) ?>
                                </strong>

                                <small>
                                    <?= e($p['category']) ?>
                                </small>

                            </td>

                            <td>
                                <?= price($p['price_paise']) ?>
                            </td>

                            <td>
                                <?= $p['active'] ? 'Live' : 'Hidden' ?>
                            </td>

                            <td>
                                <a href="?edit=<?= urlencode($p['id']) ?>">
                                    Edit
                                </a>
                            </td>

                        </tr>

                    <?php endforeach; ?>

                </tbody>

            </table>

        </div>

    </section>


    <!-- PRODUCT FORM -->

    <section class="panel">

        <h2>
            <?= $product ? 'Edit product' : 'New product' ?>
        </h2>

        <form
            method="post"
            enctype="multipart/form-data"
            class="form"
        >

            <input
                type="hidden"
                name="csrf"
                value="<?= e(token()) ?>"
            >

            <input
                type="hidden"
                name="action"
                value="save"
            >

            <?php if ($product): ?>

                <input
                    type="hidden"
                    name="id"
                    value="<?= e($product['id']) ?>"
                >

            <?php endif; ?>


            <!-- TITLE -->

            <label>

                Product title

                <input
                    name="title"
                    required
                    maxlength="255"
                    placeholder="e.g. Oversized Black T-Shirt"
                    value="<?= e($product['title'] ?? '') ?>"
                >

            </label>


            <!-- CATEGORY -->

            <label>

                Category

                <input
                    name="category"
                    required
                    placeholder="e.g. T-Shirts"
                    value="<?= e($product['category'] ?? '') ?>"
                >

            </label>


            <!-- PRICE -->

            <label>

                Price (₹)

                <input
                    name="price"
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="799"
                    value="<?= e(
                        isset($product['price_paise'])
                            ? number_format(
                                $product['price_paise'] / 100,
                                2,
                                '.',
                                ''
                            )
                            : ''
                    ) ?>"
                >

            </label>


            <!-- SIZES AND INITIAL INVENTORY -->
            <fieldset style="border:1px solid #ddd;border-radius:12px;padding:16px;margin:12px 0;">
                <legend style="font-weight:700;padding:0 8px;">Sizes and stock</legend>
                <p style="font-size:13px;margin:0 0 12px;">Select sizes to add or update for the color/GSM below. Unchecked sizes are not deleted.</p>
                <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:14px;">
                    <?php foreach (['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'] as $size): ?>
                        <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
                            <input type="checkbox" class="size-choice" name="sizes[]" value="<?= e($size) ?>">
                            <?= e($size) ?>
                        </label>
                    <?php endforeach; ?>
                </div>
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin-bottom:12px;">
                    <label>Variant color
                        <input name="variant_color" value="Black" maxlength="100" placeholder="Black">
                    </label>
                    <label>GSM
                        <input name="variant_gsm" value="220" maxlength="50" placeholder="220">
                    </label>
                </div>
                <div id="size-stock-fields" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:10px;"></div>
                <small>Selected variants use the product price above. To set different variant prices or remove sizes, use the variant manager after saving.</small>
            </fieldset>

            <!-- IMAGE UPLOAD -->

            <label>

                Product image

                <input
                    type="file"
                    name="image"
                    id="productImage"
                    accept="image/jpeg,image/png,image/webp"
                    <?= $product ? '' : 'required' ?>
                >

                <small>
                    Supported: JPG, PNG, WebP. Maximum 5 MB.
                </small>

            </label>


            <!-- IMAGE PREVIEW -->

            <div
                id="imagePreviewContainer"
                style="margin-bottom:15px; <?= !empty($product['image_url']) ? '' : 'display:none;' ?>"
            >

                <img
                    id="imagePreview"
                    src="<?= !empty($product['image_url'])
                        ? e(
                            preg_match('~^https?://~i', $product['image_url'])
                                ? $product['image_url']
                                : (str_starts_with($product['image_url'], '/')
                                    ? $product['image_url']
                                    : rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\')
                                        . '/' . ltrim($product['image_url'], '/'))
                        )
                        : '' ?>"
                    alt="Product preview"
                    style="
                        width:180px;
                        max-width:100%;
                        height:180px;
                        object-fit:cover;
                        border-radius:12px;
                        border:1px solid #ddd;
                    "
                >

            </div>


            <!-- DESCRIPTION -->

            <label>

                Description

                <textarea
                    name="description"
                    rows="4"
                    placeholder="Describe your product..."
                ><?= e($product['description'] ?? '') ?></textarea>

            </label>


            <!-- VISIBILITY -->

            <label class="check">

                <input
                    type="checkbox"
                    name="active"
                    <?= !$product || $product['active']
                        ? 'checked'
                        : '' ?>
                >

                Visible in store

            </label>


            <button class="btn" type="submit">
                <?= $product ? 'Update product' : 'Create product' ?>
            </button>

        </form>

    </section>

</div>


<?php if ($product): ?>

    <!-- PRODUCT VARIANTS -->

    <section class="panel">

        <h2>
            Sizes, colors and inventory —
            <?= e($product['title']) ?>
        </h2>

        <form class="variantform" method="post">

            <input
                type="hidden"
                name="csrf"
                value="<?= e(token()) ?>"
            >

            <input
                type="hidden"
                name="action"
                value="variant"
            >

            <input
                type="hidden"
                name="product_id"
                value="<?= e($product['id']) ?>"
            >


            <label>

                Size

                <input
                    name="size"
                    placeholder="M"
                    required
                >

            </label>


            <label>

                Color

                <input
                    name="color"
                    placeholder="Black"
                    required
                >

            </label>


            <label>

                GSM

                <input
                    name="gsm"
                    placeholder="220"
                >

            </label>


            <label>

                Price (₹)

                <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                >

            </label>


            <label>

                Stock

                <input
                    name="stock"
                    type="number"
                    min="0"
                    required
                >

            </label>


            <button class="btn">
                Add / update
            </button>

        </form>


        <div class="tablewrap">

            <table>

                <thead>

                    <tr>
                        <th>Size</th>
                        <th>Color</th>
                        <th>GSM</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th></th>
                    </tr>

                </thead>

                <tbody>

                    <?php foreach ($variants as $v): ?>

                        <tr>

                            <td><?= e($v['size']) ?></td>

                            <td><?= e($v['color']) ?></td>

                            <td><?= e($v['gsm']) ?></td>

                            <td><?= price($v['price_paise']) ?></td>

                            <td><?= e($v['stock']) ?></td>

                            <td>

                                <form
                                    method="post"
                                    data-confirm="Delete this variant?"
                                >

                                    <input
                                        type="hidden"
                                        name="csrf"
                                        value="<?= e(token()) ?>"
                                    >

                                    <input
                                        type="hidden"
                                        name="action"
                                        value="remove_variant"
                                    >

                                    <input
                                        type="hidden"
                                        name="variant_id"
                                        value="<?= e($v['id']) ?>"
                                    >

                                    <button class="linkdanger">
                                        Delete
                                    </button>

                                </form>

                            </td>

                        </tr>

                    <?php endforeach; ?>

                </tbody>

            </table>

        </div>

    </section>

<?php endif; ?>


<script>
document.addEventListener('DOMContentLoaded', function () {

    const sizeChoices = document.querySelectorAll('.size-choice');
    const sizeStockFields = document.getElementById('size-stock-fields');
    const sizeInputs = {};
    function refreshSizeStocks() {
        if (!sizeStockFields) return;
        sizeChoices.forEach(function (checkbox) {
            const size = checkbox.value;
            if (checkbox.checked && !sizeInputs[size]) {
                const label = document.createElement('label');
                label.textContent = 'Stock for ' + size;
                const input = document.createElement('input');
                input.type = 'number';
                input.name = 'size_stock[' + size + ']';
                input.min = '0';
                input.step = '1';
                input.required = true;
                input.value = '0';
                label.appendChild(input);
                sizeInputs[size] = label;
                sizeStockFields.appendChild(label);
            } else if (!checkbox.checked && sizeInputs[size]) {
                sizeInputs[size].remove();
                delete sizeInputs[size];
            }
        });
    }
    sizeChoices.forEach(function (checkbox) {
        checkbox.addEventListener('change', refreshSizeStocks);
    });
    refreshSizeStocks();

    const imageInput = document.getElementById('productImage');
    const imagePreview = document.getElementById('imagePreview');
    const previewContainer = document.getElementById('imagePreviewContainer');

    if (!imageInput) return;

    imageInput.addEventListener('change', function () {

        const file = this.files[0];

        if (!file) return;

        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp'
        ];

        if (!allowedTypes.includes(file.type)) {
            alert('Please select a JPG, PNG or WebP image.');
            this.value = '';
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Image size must be less than 5 MB.');
            this.value = '';
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {

            imagePreview.src = event.target.result;
            previewContainer.style.display = 'block';

        };

        reader.readAsDataURL(file);

    });

});
</script>

<?php endLayout(); ?>
