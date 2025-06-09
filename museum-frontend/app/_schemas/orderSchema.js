import { z } from 'zod'

const hasProduct = (cartItems) =>
  cartItems.some((item) => item.type === 'product')

export const OrderSchema = z
  .object({
    name: z.string().min(1, '請填寫姓名'),
    phone: z
      .string()
      .min(1, '請填寫電話')
      .regex(/^09\d{8}$/, '請填寫正確的手機號碼'),

    email: z.string().min(1, '請輸入電子信箱').email('Email 格式錯誤'),

    shippingMethod: z.enum(['宅配', '超商']).optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    address: z.string().optional(),
    store: z.string().optional(),

    paymentMethod: z.enum(['credit', 'linepay']),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCVC: z.string().optional(),
    cardHolder: z.string().optional(),
    shippingFee: z.number().min(0, '請提供運費'),
    cartItems: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        type: z.enum(['product', 'course']),
        price: z.number(),
        quantity: z.number(),
      })
    ),
  })
  .refine(
    (data) => {
      if (hasProduct(data.cartItems) && data.shippingMethod === '宅配') {
        return (
          data.city?.trim() && data.district?.trim() && data.address?.trim()
        )
      }
      return true
    },
    {
      message: '請填寫完整宅配地址',
      path: ['city'],
    }
  )

  // 超商驗證：只有當購物車有商品且選超商時才驗證
  .refine(
    (data) => {
      if (hasProduct(data.cartItems) && data.shippingMethod === '超商') {
        return !!data.store?.trim()
      }
      return true
    },
    {
      message: '請選擇超商門市',
      path: ['store'],
    }
  )

  // 信用卡資訊驗證
  .refine(
    (data) => {
      if (data.paymentMethod === 'credit') {
        return (
          data.cardNumber?.trim() &&
          data.cardExpiry?.trim() &&
          data.cardCVC?.trim() &&
          data.cardHolder?.trim()
        )
      }
      return true
    },
    {
      message: '請填寫完整信用卡資訊',
      path: ['cardNumber'],
    }
  )
