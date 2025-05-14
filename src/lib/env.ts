const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;
const API_LOGIN = process.env.NEXT_PUBLIC_BACKEND_API_LOGIN as string;
const API_LOGOUT = process.env.NEXT_PUBLIC_BACKEND_API_LOGOUT as string;
const JWT_SECRET = process.env.JWT_SECRET as string;
const INTERNAL_API = process.env.INTERNAL_API_URL as string;

export { BASE_URL, API_LOGIN, API_LOGOUT, JWT_SECRET, INTERNAL_API };
