"use client"
import Main from "@/components/Main";
import axios from "axios";

export const dynamic = 'force-dynamic'

export default async function Home() {
    
  return (
    <>
      <Main BACKEND_API={process.env.BACKEND_API} />
    </>
  );
}
