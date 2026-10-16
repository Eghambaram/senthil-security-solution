import { handleEnquiry } from "@/lib/forms/handlers";

export async function POST(request: Request): Promise<Response> {
  return handleEnquiry(request);
}
