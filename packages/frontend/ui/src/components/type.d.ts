type VendorDataType = {
    id: string,
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

type ImageDataType = {
  public_Id: string,
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