import { Box, Typography } from "@mui/material";
import { LinkButton, TextField } from "../../components";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@mui/lab/LoadingButton";
import { ScaleLoader } from "react-spinners";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const UserSchema = z.object({
  email: z.string().email("You must enter a valid Email"),
  password: z.string(),
});

type UserSchemaType = z.infer<typeof UserSchema>;
type SignInProps = {
  callbackUrl: string;
  csrfToken: string;
};

const SignIn = ({ callbackUrl, csrfToken }: SignInProps) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserSchemaType>({ resolver: zodResolver(UserSchema) });
  const router = useRouter();
  const pathName = router.pathname;
  const onSubmit: SubmitHandler<UserSchemaType> = async (values) => {
    // try {
    const res: any = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
      callbackUrl,
    });
    if (res.error) {
      toast.error(res.error);
    } else {
      return router.push("/");
    }
    // } catch (error) {
    //   toast.error((error as Error).message);
    // }
  };

  return (
    <Box>
      <Typography variant="h4" color="primary">
        Sign In
      </Typography>
      <form
        method="post"
        action="/api/auth/signin/email"
        onSubmit={handleSubmit(onSubmit)}
        style={{ margin: "5px 10px" }}
      >
        <input type="hidden" name="csrfToken" defaultValue={csrfToken} />
        <TextField
          name="email"
          label="Email"
          placeholder="Email"
          icon={<EmailIcon />}
          register={register}
          errors={errors.email?.message}
          disabled={isSubmitting}
          autoComplete="off"
        ></TextField>
        <TextField
          name="password"
          label="Password"
          placeholder=""
          icon={<LockIcon />}
          type="password"
          register={register}
          errors={errors.password?.message}
          disabled={isSubmitting}
          autoComplete="off"
          defaultValue=""
        ></TextField>
        <LoadingButton
          loading={isSubmitting}
          loadingIndicator={<ScaleLoader color="#36d7b7" />}
          variant="contained"
          color="primary"
          type="submit"
          sx={{ width: "50%", margin: "0px auto" }}
        >
          Sign In
        </LoadingButton>
      </form>
      <Box
        sx={{
          a: { textDecoration: "none" },
        }}
      >
        <LinkButton query="forgetpassword" label="Forget your password" />
      </Box>
    </Box>
  );
};

export default SignIn;
