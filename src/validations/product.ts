import * as z from "zod"

import { products } from "@/db/schema"
import { categoryIdSchema, categoryNameSchema } from "@/validations/category"

export const productIdSchema = z
  .string({
    required_error: "Id produktu jest wymagane",
    invalid_type_error: "Dane wejściowe muszą być tekstem",
  })
  .min(1, {
    message: "Id musi mieć przynajmniej 1 znak",
  })
  .max(32, {
    message: "Id może mieć maksymalnie 32 znaki",
  })

export const productNameSchema = z
  .string({
    required_error: "Nazwa produktu jest wymagana",
    invalid_type_error: "Nazwa musi być tekstem",
  })
  .min(3, {
    message: "Nazwa musi składać się z przynajmniej 3 znaków",
  })
  .max(128, {
    message: "Nazwa może składać się z maksymalnie 128 znaków",
  })

export const productSchema = z.object({
  name: productNameSchema,
  description: z
    .string({
      invalid_type_error: "Opis musi być tekstem",
    })
    .optional(),
  state: z.enum(products.state.enumValues, {
    required_error: "Status produktu jest wymagany",
    invalid_type_error:
      "Status produktu musi być jedną z predefiniowanych wartości tekstowych",
  }),
  importance: z.enum(products.importance.enumValues, {
    required_error: "Ważność produktu jest wymagana",
    invalid_type_error:
      "Ważność produktu musi być jedną z predefiniowanych wartości tekstowych",
  }),
  categoryName: z.string({
    invalid_type_error: "Nazwa kategorii musi być tekstem",
    required_error: "Nazwa kategorii jest wymagana",
  }),
  subcategoryName: z.string({
    invalid_type_error: "Nazwa podkategorii musi być tekstem",
    required_error: "Nazwa podkategorii jest wymagana",
  }),
  price: z
    .string({
      required_error: "Cena jest wymagana",
      invalid_type_error: "Cena musi być tekstem",
    })
    .regex(/^\d+(\.\d{1,2})?$/, {
      message: "Nieprawidłowy format. Spróbuj z kropką, np. 120.99",
    }),
  inventory: z
    .number({
      required_error: "Ilość jest wymagana",
      invalid_type_error: "Ilość dostępna w magazynie musi być liczbą",
    })
    .min(0, { message: "Ilość dostępna w magazynie nie może być ujemna" }),
  images: z
    .unknown()
    .refine((val) => {
      if (!Array.isArray(val)) return false
      if (val.some((file) => !(file instanceof File))) return false
      return true
    }, "Dane wejściowe muszą być szeregiem elementów typu File")
    .optional()
    .nullable()
    .default(null),
})

export const addProductSchema = productSchema

export const addProductFunctionSchema = productSchema
  .omit({
    images: true,
  })
  .extend({
    images: z
      .array(z.object({ id: z.string(), name: z.string(), url: z.string() }))
      .nullable(),
  })

export const getProductByIdSchema = z.object({
  id: productIdSchema,
})

export const getProductByNameSchema = z.object({
  name: productNameSchema,
})

export const getProductInventorySchema = z.object({
  id: productIdSchema,
})

export const getProductCountByCategoryNameSchema = z.object({
  name: categoryNameSchema,
})

export const getProductCountByCategoryIdSchema = z.object({
  id: categoryIdSchema,
})

export const updateProductSchema = productSchema
  .omit({
    images: true,
  })
  .extend({
    id: productIdSchema,
    images: z
      .array(z.object({ id: z.string(), name: z.string(), url: z.string() }))
      .nullable(),
  })

export const deleteProductSchema = z.object({
  id: productIdSchema,
})

export const filterProductsSchema = z.object({
  query: z.string(),
})

export const checkIfProductNameTakenSchema = z.object({
  name: productNameSchema,
})

export const checkIfProductExistsSchema = z.object({
  id: productIdSchema,
})

export type GetProductByIdInput = z.infer<typeof getProductByIdSchema>

export type GetProductByNameInput = z.infer<typeof getProductByNameSchema>

export type GetProductsInput = z.infer<typeof getProductsSchema>

export type GetProductCountByCategoryNameInput = z.infer<
  typeof getProductCountByCategoryNameSchema
>

export type GetProductCountByCategoryIdInput = z.infer<
  typeof getProductCountByCategoryIdSchema
>

export type AddProductInput = z.infer<typeof addProductSchema>

export type UpdateProductInput = z.infer<typeof updateProductSchema>

export type DeleteProductInput = z.infer<typeof deleteProductSchema>

export type FilterProductsInput = z.infer<typeof filterProductsSchema>

export type CheckIfProductExistsInput = z.infer<
  typeof checkIfProductExistsSchema
>

export type CheckIfProductNameTakenInput = z.infer<
  typeof checkIfProductNameTakenSchema
>
