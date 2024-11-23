"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function Home() {
  const redirect = useRouter()
  redirect.push("/home")
  return <></>
}
