import { z } from 'zod'

export const OrderSchema = z
  .object({
    name: z.string().min(1, '請填寫姓名'),
    email: z.string().email('Email 格式錯誤'),
    phone: z.string().min(8, '請填寫電話'),

    shippingMethod: z.enum(['宅配', '超商']),
    city: z.string().optional(), // ✅ 改成 optional
    district: z.string().optional(), // ✅
    address: z.string().optional(), // ✅
    store: z.string().optional(), // ✅ 超商門市

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

  // ✅ 當付款方式為信用卡時，需填卡片欄位
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

  // ✅ 當為「宅配」時才檢查地址欄位
  .refine(
    (data) => {
      if (data.shippingMethod === '宅配') {
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

  // ✅ 當為「超商」時才檢查 store 欄位
  .refine(
    (data) => {
      if (data.shippingMethod === '超商') {
        return !!data.store?.trim()
      }
      return true
    },
    {
      message: '請選擇超商門市',
      path: ['store'],
    }
  )
