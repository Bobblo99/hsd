"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Settings, User, Eye, EyeOff } from "lucide-react";
import { USE_DUMMY_DATA, DUMMY_CREDENTIALS } from "@/lib/config";
import { signInAdmin } from "@/lib/auth";
import { signInAdmin as signInDummyAdmin } from "@/lib/auth-dummy";

const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Bitte geben Sie eine gültige E-Mail-Adresse ein" }),
  password: z.string().min(1, { message: "Passwort ist erforderlich" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);

    try {
      const user = USE_DUMMY_DATA 
        ? await signInDummyAdmin(values.email, values.password)
        : await signInAdmin(values.email, values.password);

      if (user) {
        toast({
          title: "Anmeldung erfolgreich",
          description: "Willkommen im Admin-Dashboard.",
        });

        router.push("/admin/dashboard");
      } else {
        toast({
          title: "Anmeldung fehlgeschlagen",
          description: "Ungültige E-Mail oder Passwort.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Anmeldung fehlgeschlagen:", error);
      toast({
        title: "Anmeldung fehlgeschlagen",
        description:
          "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md bg-white/5 border-white/10">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-4">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl text-white">
            <span className="text-red-500">HSD</span> Admin
          </CardTitle>
          <CardDescription className="text-gray-400">
            Zugang zum Terminverwaltungssystem
          </CardDescription>
          {USE_DUMMY_DATA && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mt-4">
              <p className="text-blue-400 text-sm font-medium mb-2">🎭 Demo-Modus aktiv</p>
              <p className="text-xs text-gray-400">
                E-Mail: {DUMMY_CREDENTIALS.email}<br />
                Passwort: {DUMMY_CREDENTIALS.password}
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">E-Mail</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="E-Mail eingeben"
                          className="pl-10 bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500"
                          type="email"
                          defaultValue={USE_DUMMY_DATA ? DUMMY_CREDENTIALS.email : ""}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Passwort</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Settings className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Passwort eingeben"
                          className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500"
                          defaultValue={USE_DUMMY_DATA ? DUMMY_CREDENTIALS.password : ""}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-white"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Anmeldung..." : "Anmelden"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}