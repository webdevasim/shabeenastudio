import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createPaymentOrder, verifyPayment, loadRazorpay } from '../../services/payments';
import { useStore } from '../../store/useStore';

const checkoutSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian phone number'),
  address: z.string().min(8, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit Indian PIN code'),
  paymentMethod: z.enum(['upi', 'card', 'netbanking', 'cod']),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setCheckoutOpen,
    cart,
    clearCart,
    discountPercentage,
    setActiveScreen,
  } = useStore();

  const [paymentError, setPaymentError] = useState('');
  const [orderCompleteData, setOrderCompleteData] = useState<{
    orderId: string;
    total: number;
    email: string;
    phone: string;
    paymentMethod: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      paymentMethod: 'upi',
    },
  });

  const selectedPayment = watch('paymentMethod');

  if (!isCheckoutOpen) return null;

  const rawSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = Math.round((rawSubtotal * discountPercentage) / 100);
  const subtotalAfterDiscount = rawSubtotal - discountAmount;
  const shippingFee = subtotalAfterDiscount >= 1499 || cart.length === 0 ? 0 : 99;
  const grandTotal = subtotalAfterDiscount + shippingFee;

  const onSubmit = async (data: CheckoutFormData) => {
    setPaymentError('');
    if (data.paymentMethod === 'cod') {setPaymentError('Cash on delivery is not enabled. Select an online payment method.');return;}
    try {
      const payment = await createPaymentOrder({customer:data,items:cart.map(item=>({productId:item.productId,quantity:item.quantity,size:item.size,colorName:item.colorName,gsm:item.customDetails?.gsm || item.specsSummary?.match(/\d+ GSM/)?.[0] || '',isCustom:item.isCustom}))});
      await loadRazorpay();
      const Razorpay = (window as any).Razorpay;
      const checkout = new Razorpay({key:payment.key_id,amount:payment.amount,currency:'INR',order_id:payment.razorpay_order_id,name:'Shabeena Studio',prefill:{name:data.fullName,email:data.email,contact:data.phone},handler:async(response:any)=>{
        try {await verifyPayment(response);setOrderCompleteData({orderId:payment.order_id,total:payment.amount/100,email:data.email,phone:data.phone,paymentMethod:'RAZORPAY'});clearCart();}
        catch(e){setPaymentError(e instanceof Error?e.message:'Payment verification pending. Contact support with your payment reference.');}
      },modal:{ondismiss:()=>setPaymentError('Payment cancelled. Your cart has been retained.')}});
      checkout.on('payment.failed',()=>setPaymentError('Payment failed. Please try again.'));
      checkout.open();
    } catch(e) {setPaymentError(e instanceof Error?e.message:'Unable to start payment.');}
  };

  const handleClose = () => {
    setCheckoutOpen(false);
    setOrderCompleteData(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-sm shadow-2xl border border-[#e2e3e1] overflow-hidden z-10 my-8">
        {/* Order Completed Screen */}
        {orderCompleteData ? (
          <div className="p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>

            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#ff5a36] font-semibold">
                Payment Verified — Order Confirmed
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1c1b] font-display mt-1">
                Thank you for your order!
              </h2>
              <p className="text-xs text-[#5f5e5e] mt-1 font-mono">
                Order ID: <strong className="text-[#1a1c1b]">{orderCompleteData.orderId}</strong>
              </p>
            </div>

            <div className="p-4 bg-[#f9f9f7] rounded-sm border border-[#e2e3e1] text-xs space-y-2 text-left font-mono">
              <div className="flex justify-between">
                <span className="text-[#5f5e5e]">Verified Payment:</span>
                <span className="font-bold text-[#1a1c1b]">
                  ₹{orderCompleteData.total.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5f5e5e]">Payment Mode:</span>
                <span className="text-[#1a1c1b] font-semibold">{orderCompleteData.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5f5e5e]">Dispatch Courier:</span>
                <span className="text-emerald-700 font-semibold">To be confirmed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5f5e5e]">Updates Sent To:</span>
                <span className="text-[#1a1c1b]">{orderCompleteData.email}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-left rounded-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-emerald-600">chat</span>
              <span>
                Contact number: <strong>+91 {orderCompleteData.phone}</strong> 
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  handleClose();
                  setActiveScreen('home');
                }}
                className="flex-1 py-3 bg-[#2f3130] hover:bg-black text-white text-xs font-semibold rounded-sm transition-colors"
              >
                Back to Collection
              </button>
              <button
                onClick={() => {
                  handleClose();
                  setActiveScreen('studio');
                }}
                className="flex-1 py-3 bg-[#ff5a36] hover:bg-[#e84a27] text-white text-xs font-semibold rounded-sm transition-colors"
              >
                Design Another Custom Garment
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div>
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#e2e3e1] flex items-center justify-between bg-[#f9f9f7]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff5a36] text-xl">lock</span>
                <h3 className="text-base font-bold text-[#1a1c1b] font-display uppercase tracking-tight">
                  100% Encrypted Indian Checkout
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-sm hover:bg-[#eeeeec] flex items-center justify-center text-[#5f5e5e] hover:text-[#1a1c1b]"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-5 text-xs">
              {paymentError && <div role="alert" className="border border-red-300 bg-red-50 p-3 text-red-700">{paymentError}</div>}
              {/* Shipping Details */}
              <div>
                <h4 className="font-semibold text-sm text-[#1a1c1b] font-display uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-[#ff5a36]">local_shipping</span>
                  <span>1. Shipping &amp; Contact Details</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#5f5e5e] mb-1 font-medium">Full Name</label>
                    <input
                      {...register('fullName')}
                      className="w-full bg-[#f9f9f7] border border-[#e2e3e1] rounded-sm px-3 py-2 text-xs text-[#1a1c1b] focus:border-[#1a1c1b] outline-none"
                      placeholder="e.g. Arjun Verma"
                    />
                    {errors.fullName && (
                      <span className="text-[#ba1a1a] text-[10px] mt-0.5 block">{errors.fullName.message}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#5f5e5e] mb-1 font-medium">Mobile Phone (WhatsApp Updates)</label>
                    <div className="flex">
                      <span className="px-2.5 py-2 bg-[#eeeeec] border border-r-0 border-[#e2e3e1] text-[#5f5e5e] font-mono rounded-l-sm">
                        +91
                      </span>
                      <input
                        {...register('phone')}
                        className="w-full bg-[#f9f9f7] border border-[#e2e3e1] rounded-r-sm px-3 py-2 text-xs text-[#1a1c1b] focus:border-[#1a1c1b] outline-none font-mono"
                        placeholder="9876543210"
                      />
                    </div>
                    {errors.phone && (
                      <span className="text-[#ba1a1a] text-[10px] mt-0.5 block">{errors.phone.message}</span>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#5f5e5e] mb-1 font-medium">Email Address (Invoice &amp; Tracking)</label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full bg-[#f9f9f7] border border-[#e2e3e1] rounded-sm px-3 py-2 text-xs text-[#1a1c1b] focus:border-[#1a1c1b] outline-none"
                      placeholder="arjun.verma@example.com"
                    />
                    {errors.email && (
                      <span className="text-[#ba1a1a] text-[10px] mt-0.5 block">{errors.email.message}</span>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#5f5e5e] mb-1 font-medium">Delivery Street Address</label>
                    <input
                      {...register('address')}
                      className="w-full bg-[#f9f9f7] border border-[#e2e3e1] rounded-sm px-3 py-2 text-xs text-[#1a1c1b] focus:border-[#1a1c1b] outline-none"
                      placeholder="House/Flat No., Building, Street Name, Area"
                    />
                    {errors.address && (
                      <span className="text-[#ba1a1a] text-[10px] mt-0.5 block">{errors.address.message}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#5f5e5e] mb-1 font-medium">City</label>
                    <input
                      {...register('city')}
                      className="w-full bg-[#f9f9f7] border border-[#e2e3e1] rounded-sm px-3 py-2 text-xs text-[#1a1c1b] focus:border-[#1a1c1b] outline-none"
                      placeholder="Mumbai / Bengaluru / Delhi"
                    />
                    {errors.city && (
                      <span className="text-[#ba1a1a] text-[10px] mt-0.5 block">{errors.city.message}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#5f5e5e] mb-1 font-medium">PIN Code</label>
                    <input
                      {...register('pincode')}
                      className="w-full bg-[#f9f9f7] border border-[#e2e3e1] rounded-sm px-3 py-2 text-xs text-[#1a1c1b] focus:border-[#1a1c1b] outline-none font-mono"
                      placeholder="400050"
                    />
                    {errors.pincode && (
                      <span className="text-[#ba1a1a] text-[10px] mt-0.5 block">{errors.pincode.message}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="pt-3 border-t border-[#e2e3e1]">
                <h4 className="font-semibold text-sm text-[#1a1c1b] font-display uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-[#ff5a36]">payment</span>
                  <span>2. Payment Option</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <label
                    className={`p-3 rounded-sm border cursor-pointer flex flex-col items-center text-center transition-all ${
                      selectedPayment === 'upi'
                        ? 'border-2 border-[#ff5a36] bg-[#ff5a36]/5'
                        : 'border-[#e2e3e1] hover:border-[#1a1c1b]'
                    }`}
                  >
                    <input
                      type="radio"
                      value="upi"
                      {...register('paymentMethod')}
                      className="hidden"
                    />
                    <span className="material-symbols-outlined text-lg mb-1 text-[#ff5a36]">qr_code_2</span>
                    <span className="font-bold text-[#1a1c1b]">Instant UPI</span>
                    <span className="text-[10px] text-[#5f5e5e]">GPay / PhonePe</span>
                  </label>

                  <label
                    className={`p-3 rounded-sm border cursor-pointer flex flex-col items-center text-center transition-all ${
                      selectedPayment === 'card'
                        ? 'border-2 border-[#ff5a36] bg-[#ff5a36]/5'
                        : 'border-[#e2e3e1] hover:border-[#1a1c1b]'
                    }`}
                  >
                    <input
                      type="radio"
                      value="card"
                      {...register('paymentMethod')}
                      className="hidden"
                    />
                    <span className="material-symbols-outlined text-lg mb-1 text-[#1a1c1b]">credit_card</span>
                    <span className="font-bold text-[#1a1c1b]">Cards</span>
                    <span className="text-[10px] text-[#5f5e5e]">Visa / RuPay</span>
                  </label>

                  <label
                    className={`p-3 rounded-sm border cursor-pointer flex flex-col items-center text-center transition-all ${
                      selectedPayment === 'netbanking'
                        ? 'border-2 border-[#ff5a36] bg-[#ff5a36]/5'
                        : 'border-[#e2e3e1] hover:border-[#1a1c1b]'
                    }`}
                  >
                    <input
                      type="radio"
                      value="netbanking"
                      {...register('paymentMethod')}
                      className="hidden"
                    />
                    <span className="material-symbols-outlined text-lg mb-1 text-[#1a1c1b]">account_balance</span>
                    <span className="font-bold text-[#1a1c1b]">Net Banking</span>
                    <span className="text-[10px] text-[#5f5e5e]">All Indian Banks</span>
                  </label>

                  <label
                    className={`p-3 rounded-sm border cursor-pointer flex flex-col items-center text-center transition-all ${
                      selectedPayment === 'cod'
                        ? 'border-2 border-[#ff5a36] bg-[#ff5a36]/5'
                        : 'border-[#e2e3e1] hover:border-[#1a1c1b]'
                    }`}
                  >
                    <input
                      type="radio"
                      value="cod"
                      {...register('paymentMethod')}
                      className="hidden"
                    />
                    <span className="material-symbols-outlined text-lg mb-1 text-[#1a1c1b]">payments</span>
                    <span className="font-bold text-[#1a1c1b]">Cash on Delivery</span>
                    <span className="text-[10px] text-[#5f5e5e]">Pay at Doorstep</span>
                  </label>
                </div>
              </div>

              {/* Order Breakdown */}
              <div className="p-3 bg-[#f4f4f2] rounded-sm border border-[#e2e3e1] space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-[#5f5e5e]">
                  <span>Items Total ({cart.reduce((a, b) => a + b.quantity, 0)} units):</span>
                  <span>₹{rawSubtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({discountPercentage}%):</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#5f5e5e]">
                  <span>Shipping:</span>
                  <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                </div>
                <div className="pt-1.5 border-t border-[#e2e3e1] flex justify-between font-bold text-sm text-[#1a1c1b]">
                  <span>Total Payable:</span>
                  <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full h-12 bg-[#ff5a36] hover:bg-[#e84a27] text-white font-semibold text-sm rounded-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <span>Authorize &amp; Place Order - ₹{grandTotal.toLocaleString('en-IN')}</span>
                <span className="material-symbols-outlined text-lg">check</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
