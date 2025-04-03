import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Verification = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Seu email foi confirmado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            Obrigado por confirmar seu email.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Verification;
