type ManagerDataType = {
  id: number;
  username: string;
  photo?: string;
  email: string;
  phone: string;
  location?: string;
  role: string;
  createdAt: string;
  updateAt?: string;
};

type RegisterForm = {
  id?: number;
  username: string,
  email: string,
  phone: string,
  password: string,
  confirmPassword: string,
  photo: null | File
  role?: string
}

type AdminDataType = {
  id: number;
  username: string,
  email: string,
  phone: string,
  photo: null | File
  role: string
}

type VendorDataType = {
  id: number,
  email: string,
  username: string,
  phone: string,
  shop_address: string,
  shop_name: string,
  gst_number: string,
  shop_city: string,
  shop_state: string,
  shop_pinCode: string,
  bank_account: string,
  ifsc_code: string,
  fssai_license: string,
  commission_rate?: string,
  status: string,
  oreders?: string,
  rejected_orderds?: number,
  createdAt: string,
  updatedAt?: string,
}

type APIError = {
  response: {
    data: {
      message: string;
    };
  };
};

type ImageDataType = {
  public_Id: number,
  url: string
}

type SubCategoryType = {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  image: ImageDataType;
  isActive: boolean;
  createdAt: string;
}

type CategoryType = {
  id: number;
  name: string;
  description: string;
  image: ImageDataType;
  isActive: boolean;
  subCategories?: SubCategoryType[];
  createdAt: string;
}