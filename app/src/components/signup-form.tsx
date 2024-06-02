// import z from 'zod';
// import { cn } from '@/lib/utils';
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Input } from '@/components/ui/input';
// import { useForm } from 'react-hook-form';
// import { userAuthSchema } from '@/lib/validations/auth';
// import { signIn } from '@/plugins/amplify/auth';

// interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

// type FormData = z.infer<typeof userAuthSchema>;

// export function UserSignInForm({ className, ...props }: UserAuthFormProps) {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormData>({
//     resolver: zodResolver(userAuthSchema),
//   });

//   const [isLoading, setIsLoading] = React.useState<boolean>(false);

//   async function onSubmit(data: FormData) {
//     setIsLoading(true);

//     const signInResult = await signIn({
//       email: data.email.toLowerCase(),
//       password: '',
//     });

//     setIsLoading(false);

//     if (!signInResult?.ok) {
//       return toast({
//         title: 'Something went wrong.',
//         description: 'Your sign in request failed. Please try again.',
//         variant: 'destructive',
//       });
//     }

//     return toast({
//       title: 'Check your email',
//       description: 'We sent you a login link. Be sure to check your spam too.',
//     });
//   }

//   return (
//     <div className={cn('grid gap-6', className)} {...props}>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div className="grid gap-2">
//           <div className="grid gap-1">
//             <Label className="sr-only" htmlFor="email">
//               Email
//             </Label>
//             <Input
//               id="email"
//               placeholder="name@example.com"
//               type="email"
//               autoCapitalize="none"
//               autoComplete="email"
//               autoCorrect="off"
//               disabled={isLoading || isGitHubLoading}
//               {...register('email')}
//             />
//             {errors?.email && <p className="px-1 text-xs text-red-600">{errors.email.message}</p>}
//           </div>
//           <button className={cn(buttonVariants())} disabled={isLoading}>
//             {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
//             Sign In with Email
//           </button>
//         </div>
//       </form>
//       <div className="relative">
//         <div className="absolute inset-0 flex items-center">
//           <span className="w-full border-t" />
//         </div>
//         <div className="relative flex justify-center text-xs uppercase">
//           <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
//         </div>
//       </div>
//     </div>
//   );
// }