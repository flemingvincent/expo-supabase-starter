import React from "react";
import { SupabaseContext } from "./SupabaseContext";

export const useSupabase = () => React.useContext(SupabaseContext);
