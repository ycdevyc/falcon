import { supabase } from "@/lib/supabase";

export type CurrentDriver = {
  id: string;
  name: string;
  auth_user_id: string | null;
  vehicle_id: string | null;
  phone?: string | null;
  languages?: string | null;
  rating?: number | null;
  is_active?: boolean | null;
  profile_photo?: string | null;
};

export async function getCurrentDriver() {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!userData.user) {
    return null;
  }

  const { data: driver, error: driverError } = await supabase
    .from("drivers")
    .select("*")
    .eq("auth_user_id", userData.user.id)
    .single();

  if (driverError) {
    throw new Error("No driver profile linked to this account.");
  }

  return driver as CurrentDriver;
}