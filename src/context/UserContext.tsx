"use client";
import { User } from "@/types/auth";
import { createContext } from "react";

export const UserContext = createContext<User | null>(null);
