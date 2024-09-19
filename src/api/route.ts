export async function views() {
  try {
    const targetUrl = `${apiBase}/views`;
    const response = await fetch(targetUrl, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      }, 
    });
    if (!response.ok) {
      return null;
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
}
export async function passwordchanges(payload: any) {
  try {
    await initializeScheduling();
    const targetUrl = `${apiBaseAuthentication}/password-change`;
    const urlEncodedData = new URLSearchParams(payload).toString();    
    const response = await fetch(targetUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: urlEncodedData,
    });
    return response.status;
  } catch (error) {
    console.error("Error fetching test data:", error);
    return null;
  }
}

export async function view(id: number) {
  try {
    const targetUrl = `${apiBase}/views/${id}`;
    const response = await fetch(targetUrl, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      return null;
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
}

export async function Filters(id: number) {
  try {
    const targetUrl = `${apiBase}/views/${id}/filters`;
    const response = await fetch(targetUrl, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Response is not JSON");
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}
export async function LogoutApi(payload: any) {
  try {
    await initializeScheduling();
    const targetUrl = `${apiBaseAuthentication}#logout`;
    const urlEncodedData = new URLSearchParams(payload).toString();
 
    const response = await fetch(targetUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: urlEncodedData,
    });
 
    if (response.ok) {    
      clearCookie("User");
    } 
    return response.status;
  } catch (error) {
    console.error("Error fetching test data:", error);
    return null;
  }
} 
function clearCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}



export async function Preferencess(
  viewId: number,
  filterId: number,
  payload: any
) {
  try {
    const targetUrl = `${apiBase}/views/${viewId}/filters/preferences/${filterId}`;
    const response = await fetch(targetUrl, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 403) {

      return response.status;
    }else if(response.status=== 200){

      const responseData = await response.json()
      return responseData;
        
    }
 return"Unknown Errored occured!"
 
  } catch (error) {
   
    throw error;
  }
}



export async function Modified(
  viewId: number,
  id: number,
  sid: number,
  Payload: any
) {
  const targetUrl = `${apiBase}/views/${viewId}/filters/${id}/schedules/${sid}`;
  try {
    await initializeScheduling();
    const response = await fetch(targetUrl, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Payload),
    });
    console.log("Response Status:", response.status);
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `HTTP error! Status: ${response.status}, Details: ${errorData}`
      );
    }
    if (response.status === 201) {
      console.log("Filter created successfully");
      const location = response.headers.get("Location");
      console.log("Created filter location:", location);
      return location;
    } else if (response.status === 422) {
      console.error("Unprocessable Entity: Check your request data.");
    } else {
      console.error("Unexpected response status:", response.status);
    }
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

export async function Fillters(viewId: number, id: number) {
  try {
    const targetUrl = `${apiBase}/views/${viewId}/filters/${id}`;
    const response = await fetch(targetUrl, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Response is not JSON");
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}
export async function FillterDelete(id: number, viewId: number) {
  try {
    const targetUrl = `${apiBase}/views/${viewId}/filters/${id}`;
    const response = await fetch(targetUrl, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.status;
  } catch (error) {
    console.error("Error:", error);
  }
}
export async function Testfilter(viewId: number, payload: any) {
  try {
    await initializeScheduling();
    const targetUrl = `${apiBase}/views/${viewId}/filters/test`;

    const response = await fetch(targetUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ viewId, ...payload }),
    });

    console.log("Response Status:", response.status);
    const responseText = await response.text();

    if (response.status === 403) {
      console.error(
        "Access Denied: You do not have sufficient privileges to access this application."
      );
      return null;
    } else if (response.status !== 200) {
      console.error(`Error: Received status code ${response.status}`);
      return null;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Response is not JSON");
      return null;
    }

    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    console.error("Error fetching test data:", error);
    return null;
  }
}

export async function EditViewsDelete(payload: number[]) {
  try {
    await initializeScheduling();
    const targetUrl = `${apiBase}/views/delete`;

    const response = await fetch(targetUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload), 
    });

    return response.status;
  } catch (error) {
    console.error("Error fetching test data:", error);
    return null;
  }
}

export async function Summary(viewId: number, payload: any) {
  try {
    await initializeScheduling();
    const targetUrl = `${apiBase}/views/${viewId}/filters/test/summary`;

    const response = await fetch(targetUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ viewId, ...payload }),
    });

    console.log("Response Status:", response.status);
    const responseText = await response.text();

    if (response.status === 403) {
      console.error(
        "Access Denied: You do not have sufficient privileges to access this application."
      );
      return null;
    } else if (response.status !== 200) {
      console.error(`Error: Received status code ${response.status}`);
      return null;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Response is not JSON");
      return null;
    }

    const data = JSON.parse(responseText);
    return data;
  } catch (error) {
    console.error("Error fetching test data:", error);
    return null;
  }
}

export async function Schedule() {
  try {
    const targetUrl = "${apiBase}/schedules";
    const response = await fetch(targetUrl, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Response is not JSON");
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
}

export async function peakHour() {
  try {
    const targetUrl = `${apiBase}/dashboard/peakHour`;
    const response = await fetch(targetUrl, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 500) {
      console.error("Error: Resource not found.");
      return null;
    } else if (response.status !== 200) {
      console.error(`Error: Received status code ${response.status}`);
      return null;
    }

    const value = await response.json();
    return value;

  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}



export async function Modify(viewId: number, id: number, sid: number) {
  try {
    const targetUrl = `${apiBase}/views/${viewId}/filters/${id}/schedules/${sid}`;
    const response = await fetch(targetUrl, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 404) {
      console.error("Error: Resource not found.");
      return null;
    } else if (response.status !== 200) {
      console.error(`Error: Received status code ${response.status}`);
      return null;
    }

    const responseText = await response.text();
    try {
      const data = JSON.parse(responseText);
      return data;
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function CheckSchedules(viewId: number, id: number) {
  try {
    const targetUrl = `${apiBase}/views/${viewId}/filters/${id}/schedules`;
    const response = await fetch(targetUrl, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}
export async function SaveFilter(viewId: number, id: number, payload: any) {
  try {
    const targetUrl = `${apiBase}/views/${viewId}/filters`;
    const response = await fetch(targetUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `HTTP error! Status: ${response.status}, Details: ${errorData}`
      );
    }
    if (response.status === 201) {
      return response.status;
    } else if (response.status === 422) {
    } else {
      console.error("Unexpected response status:", response.status);
    }
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

export async function CheckScheduless(
  id: number,
  viewId: number,
  payload: any
) {
  try {
    await initializeScheduling();
    const targetUrl = `${apiBase}/views/${viewId}/filters/${id}/schedules`;
    const response = await fetch(targetUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...payload }),
    });
    const responseText = await response.text();
    if (response.status === 403) {
      console.error(
        "Access Denied: You do not have sufficient privileges to access this application."
      );
      return null;
    } else if (response.status === 404) {
      console.error("Error: Resource not found.");
      return null;
    } else if (response.status !== 200) {
      console.error(`Error: Received status code ${response.status}`);
      return null;
    }
    try {
      const data = JSON.parse(responseText);
      return data;
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function ScheduleDelete(
  id: number,
  viewId: number,
  filterId: number
) {
  try {
    const targetUrl = `${apiBase}/views/${viewId}/filters/${filterId}/schedules/${id}`;
    const response = await fetch(targetUrl, {
      method: "DELETE",
      credentials: "include",
      headers: {   
        "Content-Type": "application/json",
      },
    });
    console.log("api response", response.status);
    return response.status;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function history() {
  try {
    const targetUrl = "${apiBase}/history";
    const response = await fetch(targetUrl, {
      method: "GET",
      credentials: "include",
      headers: { 
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Response is not JSON");
      return null;
    }

    const data = await response.json();

    return data;
  } catch (error) {
    return error;
  }
}

async function initializeScheduling() {
  const response = await fetch(`${apiBase}/config/scheduling`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to initialize scheduling");
  }

  const data = await response.json();
  console.log(data);
  return data.scheduling;
}

export async function Runconfig(
  viewId: number,
  filterId: number,
  filtername: string,
  emailAddresses: string,
  signal?: AbortSignal
) {
  try {
    // Ensure the scheduling bean is initialized
    await initializeScheduling();
    const payload = {
      title: `${filtername} Results`,
      description: "QB Emailed Results",
      frequency: "INSTANT",
      toEmailAddresses: null,
    };
    const targetUrl = `${apiBase}/views/${filterId}/filters/${viewId}/schedules`; // Correct URL with parameters
    const response = await fetch(targetUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal
    });

    if (!response.ok) {
      console.error("Network response was not ok:", response.status);
      return null;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Response is not JSON");
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Request was aborted');
    } 
    else{
    console.error("Error fetching schedules:", error);
    }
    throw error;
  }
}

export async function jobs(viewId: number, filterId: number, jobid: number, signal?: AbortSignal) {
  const delay = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));
  try {
    await delay(5000);

    const targetUrl = `${apiBase}/views/${filterId}/filters/${viewId}/schedules/${jobid}/jobs`;
    const response = await fetch(targetUrl, {
      method: "GET",
      credentials: "include",
      headers: {
        
        Accept: "application/json",
      },
      signal
    });

    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Response is not JSON");
      return null;
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Request was aborted');
    } 
    return error;
  }
}

export async function jobss(viewId: number, filterId: number, jobid: number, signal?: AbortSignal) {
  const delay = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

  try {
    await delay(5000);

    const targetUrl = `${apiBase}/views/${viewId}/filters/${filterId}/schedules/${jobid}/jobs`;
    const response = await fetch(targetUrl, {
      method: "GET",
      credentials: "include",
      headers: {  
        Accept: "application/json",
      },
      signal
    });

    if (!response.ok) {
      console.error(`Error: ${response.statusText}`);
      return null;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Response is not JSON");
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Request was aborted');
    } else {
      console.error("Error fetching jobs:", error);
    }
    return null;
  }
}

export async function Runconfigss(
  viewId: number,
  filterId: number,
  filtername: string,
  emailAddresses: string,
  signal?: AbortSignal
) {
  try {
    await initializeScheduling();
    const payload = {
      title: `${filtername} Results`,
      description: "QB Emailed Results",
      frequency: "INSTANT",
      toEmailAddresses: emailAddresses,
    };

    const targetUrl = `${apiBase}/views/${viewId}/filters/${filterId}/schedules`; // Correct URL with parameters
    const response = await fetch(targetUrl, {
      method: "POST",
      credentials: "include",
      headers: {  
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      signal,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Network response was not ok:", response.status);
      return null;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Response is not JSON");
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Request was aborted');
    } else {
      console.error("Error fetching Schedules:", error);
    }
    throw error;
  }
}

const apiBase = process.env.NEXT_PUBLIC_API_BASE;
const apiBaseAuthentication = process.env.NEXT_PUBLIC_API_BASE_AUTHENTICATION;

const schedulesService = {
  Runconfig,
  jobs,
};

export default schedulesService;
