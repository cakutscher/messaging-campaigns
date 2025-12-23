export async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (data?.error) return data.error;
  } catch {
    // ignore
  }
  return `Request failed with status ${response.status}`;
}

export function isSuccessfulResponse(response: Response): boolean {
  return response.status === 202;
}
