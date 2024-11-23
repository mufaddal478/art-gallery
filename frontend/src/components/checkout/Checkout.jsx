import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { createOrder } from '../../store/slices/orderSlice';
import { clearCart } from '../../store/slices/cartSlice';
import { toast } from 'react-toastify';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [isProcessing, setIsProcessing] = useState(false);

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const validationSchema = Yup.object({
    shippingAddress: Yup.object({
      street: Yup.string().required('Street address is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      zipCode: Yup.string().required('ZIP code is required'),
      country: Yup.string().required('Country is required'),
    }),
    paymentMethod: Yup.string().required('Payment method is required'),
  });

  const handleSubmit = async (values) => {
    try {
      setIsProcessing(true);
      const orderData = {
        items: items.map((item) => ({
          artwork: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: values.shippingAddress,
        paymentMethod: values.paymentMethod,
        totalAmount: calculateTotal(),
      };

      await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate('/profile');
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            Shipping information
          </h2>

          <Formik
            initialValues={{
              shippingAddress: {
                street: user?.address?.street || '',
                city: user?.address?.city || '',
                state: user?.address?.state || '',
                zipCode: user?.address?.zipCode || '',
                country: user?.address?.country || '',
              },
              paymentMethod: 'card',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="mt-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6">
                    <label
                      htmlFor="street"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Street address
                    </label>
                    <Field
                      type="text"
                      name="shippingAddress.street"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.shippingAddress?.street &&
                      touched.shippingAddress?.street && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.shippingAddress.street}
                        </p>
                      )}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      City
                    </label>
                    <Field
                      type="text"
                      name="shippingAddress.city"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.shippingAddress?.city &&
                      touched.shippingAddress?.city && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.shippingAddress.city}
                        </p>
                      )}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700"
                    >
                      State / Province
                    </label>
                    <Field
                      type="text"
                      name="shippingAddress.state"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.shippingAddress?.state &&
                      touched.shippingAddress?.state && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.shippingAddress.state}
                        </p>
                      )}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="zipCode"
                      className="block text-sm font-medium text-gray-700"
                    >
                      ZIP / Postal code
                    </label>
                    <Field
                      type="text"
                      name="shippingAddress.zipCode"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.shippingAddress?.zipCode &&
                      touched.shippingAddress?.zipCode && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.shippingAddress.zipCode}
                        </p>
                      )}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Country
                    </label>
                    <Field
                      type="text"
                      name="shippingAddress.country"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.shippingAddress?.country &&
                      touched.shippingAddress?.country && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.shippingAddress.country}
                        </p>
                      )}
                  </div>
                </div>

                <div className="mt-6">
                  <h2 className="text-lg font-medium text-gray-900">
                    Payment method
                  </h2>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center">
                      <Field
                        id="card"
                        name="paymentMethod"
                        type="radio"
                        value="card"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                      />
                      <label
                        htmlFor="card"
                        className="ml-3 block text-sm font-medium text-gray-700"
                      >
                        Credit/Debit Card
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Field
                        id="paypal"
                        name="paymentMethod"
                        type="radio"
                        value="paypal"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                      />
                      <label
                        htmlFor="paypal"
                        className="ml-3 block text-sm font-medium text-gray-700"
                      >
                        PayPal
                      </label>
                    </div>
                  </div>
                  {errors.paymentMethod && touched.paymentMethod && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.paymentMethod}
                    </p>
                  )}
                </div>

                <div className="mt-10">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                  >
                    {isProcessing ? (
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        <span className="ml-2">Processing...</span>
                      </div>
                    ) : (
                      `Place Order • $${calculateTotal()}`
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Order summary */}
        <div className="mt-10 lg:mt-0">
          <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

          <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id} className="flex py-6 px-4 sm:px-6">
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 rounded-md"
                    />
                  </div>
                  <div className="ml-6 flex-1 flex flex-col">
                    <div className="flex">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm">
                          <span className="font-medium text-gray-700 hover:text-gray-800">
                            {item.title}
                          </span>
                        </h4>
                      </div>
                    </div>
                    <div className="flex-1 pt-2 flex items-end justify-between">
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        ${item.price * item.quantity}
                      </p>
                      <div className="ml-4">
                        <p className="text-sm text-gray-500">
                          Qty {item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <dl className="border-t border-gray-200 py-6 px-4 space-y-6 sm:px-6">
              <div className="flex items-center justify-between">
                <dt className="text-sm">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">
                  ${calculateTotal()}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm">Shipping</dt>
                <dd className="text-sm font-medium text-gray-900">$0.00</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                <dt className="text-base font-medium">Total</dt>
                <dd className="text-base font-medium text-gray-900">
                  ${calculateTotal()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
