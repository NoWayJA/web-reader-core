
import { signIn } from "@/auth"
 
export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("microsoft-entra-id")
      }}
    >
      <button type="submit">Signin with Azure Entra ID</button>
    </form>
  )
} 