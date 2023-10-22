const url = "http://localhost:4001";

//createUser emailId and Password required
export const createUser = async (input: any): Promise<any> => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input }),
  };
  try {
    const response = await fetch(url + `/api/createUser`, requestOptions);
    if (response.status == 200) {
      const data = await response.json();

      return data;
    } else {
      throw new Error("Please try again");
    }
  } catch (error) {
    throw error;
  }
};

export const login = async (input: any): Promise<any> => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input }),
  };
  try {
    const response = await fetch(url + `/api/login`, requestOptions);
    if (response.status === 401) {
      const data = await response.json();
      console.log(data.message);
      throw new Error(data.message);
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    throw error;
  }
};



export const createGroup = async (input: any): Promise<any> => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input }),
  };
  try {
    const response = await fetch(url + `/api/createGroup`, requestOptions);
    if (response.status == 200) {
      const data = await response.json();

      return data;
    } else {
      throw new Error("Please try again");
    }
  } catch (error) {
    throw error;
  }
};


export const addParticipants= async (input: any): Promise<any> => {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input }),
  };
  try {
    const response = await fetch(url + `/api/addParticipants`, requestOptions);
    if (response.status == 200) {
      const data = await response.json();

      return data;
    } else {
      throw new Error("Please try again");
    }
  } catch (error) {
    throw error;
  }
};

export const getGroupList= async (input:string): Promise<any> => {

  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  try {
    const response = await fetch(url + `/api/getGroupList/${input}`, requestOptions);
    if (response.status == 200) {
      const data = await response.json();

      return data;
    } else {
      throw new Error("Please try again");
    }
  } catch (error) {
    throw error;
  }
};


export const getUserList = async (): Promise<any> => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  try {
    const response = await fetch(url + `/api/getUserList`, requestOptions);
    if (response.status == 200) {
      const data = await response.json();

      return data;
    } else {
      throw new Error("Please try again");
    }
  } catch (error) {
    throw error;
  }
};


export const getGroupListByUser = async (input: any): Promise<any> => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  try {
    const response = await fetch(url + `/api/getGroupListForUser/${input}`, requestOptions);
    if (response.status == 200) {
      const data = await response.json();

      return data;
    } else {
      throw new Error("Please try again");
    }
  } catch (error) {
    throw error;
  }
};