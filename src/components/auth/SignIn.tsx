
import { signIn } from "@/auth"
 
export default function SignIn() {
  return (

    <div>
        <form
          action={async () => {
            "use server"
            await signIn("github")
          }}
        >
          <button type="submit">Signin with GitHub</button>
        </form>

    </div>
  )
} 