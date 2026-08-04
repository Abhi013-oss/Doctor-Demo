import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ihmaqeqblmwheqccouiu.supabase.co";
const supabaseAnonKey = "sb_publishable_GY8B0FaduD4BcdwV-SGg0Q_IGRcN_PA";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function clearTables() {
  console.log("Clearing all test appointment records from Supabase database...");
  try {
    const { data, error } = await supabase.from("appointments").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) {
      console.log("Error clearing appointments:", error.message);
    } else {
      console.log("Successfully cleared appointments table!");
    }
  } catch (err) {
    console.error("Failed to clear Supabase:", err);
  }
}

clearTables();
