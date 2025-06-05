import { getSSession } from "@/lib/get-data";
import { type NextRequest, NextResponse } from "next/server";

interface UpdateCategoryRequest {
  category: string;
  noBalanceUpdate?: boolean;
}

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { access_token } = await getSSession();
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Vehicle ID is required" },
        { status: 400 }
      );
    }

    // Parse request body
    let body: UpdateCategoryRequest;
    body = await request.json();
    console.log({ body });

    const { category, noBalanceUpdate = false } = body;

    // Validate required fields
    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    // Get base URL from environment variables
    const baseUrl = process.env.TEST_BACKEND_URL;
    if (!baseUrl) {
      console.error("TEST_BACKEND_URL environment variable is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Construct the external API URL
    const externalApiUrl = `${baseUrl}/api/v1/vehicles/update-category/${id}`;

    // Make the API call to the external service
    const response = await fetch(externalApiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        category,
        noBalanceUpdate,
      }),
    });

    // Handle non-200 responses from external API
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `External API error: ${response.status} ${response.statusText}`,
        errorText
      );

      return NextResponse.json(
        {
          error: "Failed to update vehicle category",
          details: response.statusText,
          status: response.status,
        },
        { status: response.status }
      );
    }

    // Parse response from external API
    let responseData;
    try {
      responseData = await response.json();
      console.log({ responseData });
    } catch (error) {
      // If response is not JSON, return success with basic info
      responseData = {
        success: true,
        message: "Vehicle category updated successfully",
        vehicleId: id,
        category,
      };
    }

    // Return successful response
    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Error in vehicle category update route:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

// Optional: Add other HTTP methods if needed
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use PUT to update vehicle category." },
    { status: 405 }
  );
}
