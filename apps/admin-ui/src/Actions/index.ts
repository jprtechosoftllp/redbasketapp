import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080";

export async function getActiveManagers({ pageParam }: { pageParam: number }) {
  try {
    const { data } = await axios.get(`${baseUrl}/admin/manager/get-managers-active`, {
      params: { page: pageParam, limit: 20 },
    });
    return data;
  } catch (error) {
    console.error("Failed to fetch managers:", error);
    return {
      success: false,
      managers: [],
      data: [],
      nextPage: undefined,
      hasMoref: false,
      error: "Failed to fetch managers",
    };
  }
}

export async function getArchivedManager({ pageParam }: { pageParam: number }) {
  try {
    const { data } = await axios.get(`${baseUrl}/admin/manager/get-managers-archived`, {
      params: { page: pageParam, limit: 20 },
    });
    return data;
  } catch (error) {
    console.error("Failed to fetch managers:", error);
    return {
      success: false,
      managers: [],
      data: [],
      nextPage: undefined,
      hasMore: false,
      error: "Failed to fetch managers",
    };
  }
}

export async function getActiveVendors({ pageParam }: { pageParam: number }) {
  try {
    const { data } = await axios.get(`${baseUrl}/admin/vendor/get-vendors-active`, {
      params: { page: pageParam, limit: 20 },
    });
    return data;
  } catch (error) {
    console.error("Failed to fetch vendors:", error);
    return {
      success: false,
      vendors: [],
      data: [],
      totalPages: undefined,
      nextPage: undefined,
      hasMore: false,
      error: "Failed to fetch vendors",
    };
  }
}

export async function getPendingVendors({ pageParam }: { pageParam: number }) {
  try {
    const { data } = await axios.get(`${baseUrl}/admin/vendor/get-vendors-pending`, {
      params: { page: pageParam, limit: 20 },
    });
    return data;
  } catch (error) {
    console.error("Failed to fetch vendors:", error);
    return {
      success: false,
      vendors: [],
      data: [],
      totalPages: undefined,
      nextPage: undefined,
      hasMore: false,
      error: "Failed to fetch vendors",
    };
  }
}

export async function getRejectedVendors({ pageParam }: { pageParam: number }) {
  try {
    const { data } = await axios.get(`${baseUrl}/admin/vendor/get-vendors-rejected`, {
      params: { page: pageParam, limit: 20 },
    });
    return data;
  } catch (error) {
    console.error("Failed to fetch vendors:", error);
    return {
      success: false,
      vendors: [],
      data: [],
      totalPages: undefined,
      nextPage: undefined,
      hasMore: false,
      error: "Failed to fetch vendors",
    };
  }
}

export const dynamic = "force-dynamic";