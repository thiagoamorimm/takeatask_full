"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar para o caminho correto da página de login
    router.replace("/auth/login");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Redirecionando para a página de login...</p>
    </div>
  );
}
