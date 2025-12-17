import { Button } from "@/components/ui/button";
import { listUsers } from "@/modules/users/actions";
import Link from "next/link";

export default async function Page() {

    try {
        const users = await listUsers();
        return (
            <div className="w-full h-full min-h-screen flex flex-col gap-4 items-center justify-center">
               <p>
                   Welcome to the Example Admin Dashboard!
               </p>
               <pre className="mt-4 bg-gray-100 rounded p-4">{JSON.stringify(await users, null, 2)}</pre>
           </div>
       );
   } catch (error) {
       console.error(error);
       return (
           <div className="w-full h-full min-h-screen flex items-center justify-center">
               <p>Failed to load users</p>
           </div>
       );
   }
}