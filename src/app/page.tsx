import { auth } from "@/auth";
import Dashboard from "@/components/Dashboard";
import EmptyHome from "@/components/EmptyHome";

export default async function Home() {
    const session = await auth()
  

  return (
    <div>  
      {session ? <Dashboard/> : <EmptyHome/> }  
    </div>
  );
}
