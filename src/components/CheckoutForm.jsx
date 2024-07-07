import React from 'react';
import { Form } from 'react-router-dom';
import FormInput from './FormInput';
import SubmitBtn from './SubmitBtn';
import { customFetch, formatPrice } from '../utils';
import { toast } from 'react-toastify';
import { clearCart } from '../features/cart/cartSlice';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-js';

export const action =
  (store, queryClient) =>
  async ({ request }) => {
    const formData = await request.formData();
    const { name, address, email } = Object.fromEntries(formData);
    const user = store.getState().userState.user;
    const { cartItems, orderTotal, numItemsInCart } =
      store.getState().cartState;

    const info = {
      name,
      address,
      chargeTotal: orderTotal,
      orderTotal: formatPrice(orderTotal),
      cartItems,
      numItemsInCart,
    };

    try {
      const response = await customFetch.post(
        '/orders',
        { data: info },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      queryClient.removeQueries(['orders']);
      store.dispatch(clearCart());
      toast.success('order placed successfully');
      return redirect('/orders');
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.error?.message ||
        'there was an error placing your order';
      toast.error(errorMessage);
      if (error?.response?.status === 401 || 403) return redirect('/login');
      return null;
    }
  };

const CheckoutForm = () => {
  const handlePayment = async () => {
    try {
      const items = [
        {
          title: 'Product Title', // Ajuste o título conforme necessário
          unit_price: 100, // Ajuste o preço conforme necessário
          quantity: 1, // Ajuste a quantidade conforme necessário
        },
      ];

      const response = await fetch('/api/create_preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items, email: 'user@example.com' }), // Adicione o email do usuário
      });

      const data = await response.json();
      if (data.id) {
        // Inicialize o Mercado Pago
        initMercadoPago('YOUR_PUBLIC_KEY'); // Substitua pela sua chave pública do Mercado Pago

        // Configure o widget de pagamento
        const wallet = new Wallet({
          initialization: {
            preferenceId: data.id,
          },
          render: {
            container: '.wallet-container', // O contêiner onde o widget será renderizado
            label: 'Pagar', // Texto do botão de pagamento
          },
        });

        wallet.render();
      } else {
        throw new Error('Erro ao criar a preferência de pagamento');
      }
    } catch (error) {
      console.error('Erro ao criar a preferência de pagamento:', error);
    }
  };

  return (
    <Form method='POST' className='flex flex-col gap-y-4'>
      <h4 className='font-medium text-xl capitalize'>Informações de envio</h4>
      <FormInput label='Nome' name='name' type='text' />
      <FormInput label='Endereço' name='address' type='text' />
      <FormInput label='Email' name='email' type='email' />
      <div className='mt-4'>
        <SubmitBtn text='Faça seu pedido' />
      </div>
      <button type='button' onClick={handlePayment} className='btn btn-primary'>
        Pagar com Mercado Pago
      </button>
      <div className="wallet-container"></div>
    </Form>
  );
};

export default CheckoutForm;
