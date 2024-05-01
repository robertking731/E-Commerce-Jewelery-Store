import * as z from "zod"

import { users } from "@/db/schema"
import { passwordSchema } from "@/validations/auth"
import { emailSchema } from "@/validations/email"

const userNameSchema = z
  .string({
    invalid_type_error: "Imię lub nazwisko muszą być tekstem",
  })
  .optional()

const userIdSchema = z
  .string({
    required_error: "Id użytkownika jest wymagane",
    invalid_type_error: "Dane wejściowe muszą być tekstem",
  })
  .min(1, {
    message: "Id musi mieć przynajmniej 1 znak",
  })
  .max(512, {
    message: "Id może mieć maksymalnie 512 znaków",
  })

export const userSchema = z.object({
  name: userNameSchema,
  surname: userNameSchema,
  role: z
    .enum(users.role.enumValues, {
      required_error: "Rola jest wymagana",
      invalid_type_error:
        "Rola musi być jedną z predefiniowanych wartości tekstowych",
    })
    .default("klient"),
  email: emailSchema,
  password: passwordSchema.regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
    {
      message:
        "Hasło musi mieć od 8 do 256 znaków, zawierać przynajmniej jedną wielką literę, jedną małą literę, jedną liczbę, oraz jedną znak specjalny",
    }
  ),
})

export const getUserByEmailSchema = z.object({
  email: emailSchema,
})

export const getUserByIdSchema = z.object({
  id: userIdSchema,
})

export const getUserByResetPasswordTokenSchema = z.object({
  token: z.string(),
})

export const getUserByEmailVerificationTokenSchema = z.object({
  token: z.string(),
})

export const addUserAsAdminSchema = userSchema
  .extend({
    confirmPassword: passwordSchema,
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: "Podane hasła są różne",
    path: ["confirmPassword"],
  })

export const updateUserAsAdminSchema = userSchema
  .omit({
    password: true,
  })
  .extend({
    id: userIdSchema,
    createdAt: z.date(),
  })

export const updateUserSchema = userSchema
  .omit({
    role: true,
  })
  .extend({
    confirmPassword: passwordSchema,
  })

export const deleteUserSchema = z.object({
  id: userIdSchema,
})

export const checkIfUserExistsSchema = z.object({
  id: userIdSchema,
})

export type GetUserByEmailInput = z.infer<typeof getUserByEmailSchema>

export type GetUserByIdInput = z.infer<typeof getUserByIdSchema>

export type GetUserByResetPasswordTokenInput = z.infer<
  typeof getUserByResetPasswordTokenSchema
>

export type GetUserByEmailVerificationTokenInput = z.infer<
  typeof getUserByEmailVerificationTokenSchema
>

export type AddUserAsAdminInput = z.infer<typeof addUserAsAdminSchema>

export type UpdateUserAsAdminInput = z.infer<typeof updateUserAsAdminSchema>

export type UpdateUserInput = z.infer<typeof updateUserSchema>

export type DeleteUserInput = z.infer<typeof deleteUserSchema>

export type CheckIfUserExistsInput = z.infer<typeof checkIfUserExistsSchema>
