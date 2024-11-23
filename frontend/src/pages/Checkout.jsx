import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createOrder } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';
import { ShippingSchema } from '../utils/validationSchemas';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.order);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const orderData = {
        orderItems: items.map(item => ({
          artwork: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: values,
        paymentMethod: values.paymentMethod,
        totalPrice: totalAmount,
      };

      const result = await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCart());
      navigate(`/orders/${result._id}`);
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || items.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h2>

        <Formik
          initialValues={{
            address: '',
            city: '',
            postalCode: '',
            country: '',
            paymentMethod: 'card',
          }}
          validationSchema={ShippingSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
              <div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Shipping information</h3>

                  <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <div className="sm:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <Field
                        id="address"
                        name="address"
                        type="text"
                        className={`mt-1 block w-full border ${
                          errors.address && touched.address
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      />
                      {errors.address && touched.address && (
                        <div className="text-red-500 text-xs mt-1">{errors.address}</div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <Field
                        id="city"
                        name="city"
                        type="text"
                        className={`mt-1 block w-full border ${
                          errors.city && touched.city
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      />
                      {errors.city && touched.city && (
                        <div className="text-red-500 text-xs mt-1">{errors.city}</div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                        Postal code
                      </label>
                      <Field
                        id="postalCode"
                        name="postalCode"
                        type="text"
                        className={`mt-1 block w-full border ${
                          errors.postalCode && touched.postalCode
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      />
                      {errors.postalCode && touched.postalCode && (
                        <div className="text-red-500 text-xs mt-1">{errors.postalCode}</div>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                        Country
                      </label>
                      <Field
                        id="country"
                        name="country"
                        type="text"
                        className={`mt-1 block w-full border ${
                          errors.country && touched.country
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      />
                      {errors.country && touched.country && (
                        <div className="text-red-500 text-xs mt-1">{errors.country}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <h3 className="text-lg font-medium text-gray-900">Payment method</h3>
                  <div className="mt-4">
                    <div className="flex items-center">
                      <Field
                        type="radio"
                        id="card"
                        name="paymentMethod"
                        value="card"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                      />
                      <label htmlFor="card" className="ml-3 block text-sm font-medium text-gray-700">
                        Credit/Debit Card
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 lg:mt-0">
                <h3 className="text-lg font-medium text-gray-900">Order summary</h3>

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
                                {item.title}
                              </h4>
                            </div>
                          </div>
                          <div className="flex-1 pt-2 flex items-end justify-between">
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              ${item.price}
                            </p>
                            <div className="ml-4">
                              Qty {item.quantity}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <dl className="border-t border-gray-200 py-6 px-4 space-y-6 sm:px-6">
                    <div className="flex items-center justify-between">
                      <dt className="text-base font-medium">Total</dt>
                      <dd className="text-base font-medium text-gray-900">${totalAmount}</dd>
                    </div>
                  </dl>

                  <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                    <button
                      type="submit"
                      disabled={isSubmitting || isLoading}
                      className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {isSubmitting || isLoading ? 'Processing...' : 'Confirm order'}
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Checkout;
