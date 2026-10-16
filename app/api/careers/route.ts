import { handleCareers } from "@/lib/forms/handlers";

export async function POST(request: Request): Promise<Response> {
  return handleCareers(request);
}
