const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockLogin = async (_email: string, _password: string) => {
  await delay(1200);
  return { success: true, userId: 'dummy-user-001' };
};

export const mockSignup = async (_email: string, _password: string) => {
  await delay(1500);
  return { success: true, userId: 'dummy-user-001' };
};

export const mockGoogleLogin = async () => {
  await delay(800);
  return { success: true, userId: 'dummy-user-001' };
};

export const mockQoo10Connect = async (_apiKey: string) => {
  await delay(1500);
  return {
    success: true,
    storeName: 'デイゼロ東京セレクト',
    sellerId: 'QA_test_seller',
  };
};

export const mockFetchSellerInfo = async () => {
  await delay(1000);
  return {
    success: true,
    data: {
      zipCode: '135-0064',
      addressLine1: '東京都江東区青海1-1-20',
      addressLine2: 'ダイバーシティ東京オフィスタワー',
      contact: '03-1234-5678'
    }
  };
};
