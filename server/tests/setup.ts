import { beforeAll } from "vitest";

// Set test environment variables before any tests run
beforeAll(() => {
  process.env.NODE_ENV = "development";
  process.env.PORT = "3001";
  process.env.CORS_ORIGIN = "http://localhost:3001";
  process.env.DATABASE_URL =
    "postgresql://postgres:big!stepper@@localhost:5432/kompa_db";
  process.env.FIREBASE_PROJECT_ID = "adamus-beneficiaries";
  process.env.FIREBASE_CLIENT_EMAIL =
    "firebase-adminsdk-3xcd6@adamus-beneficiaries.iam.gserviceaccount.com";
  process.env.FIREBASE_PRIVATE_KEY =
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDghJ44sZM6NiJq\nOjKWNsK2wwFFdVw20T4iSqduzb9hhLIQUQhI9gOrrpUKm4pTkn4beJmHsK4r/EXn\n2HOfTn1jIyBowHbfCJC56MnKSU0VmlohWCFHkdMPNi6nGNpTJevNe04Qd7hXW9v0\npaQ5H9odQelTQXch3jpMzMxsfOqzNzO4PV6C7apyi6YLT+c00tUkbyexEx4R0A5P\nsknUQmSQVLH9f3Ry3V6GzDUfIZwg3URqftgWMdjludn93nN9baKd83nNCz1pyEHk\nXCDKonQuufbobqKh7B9/zTeCUGJnjympHQyGYWCTKEdFF93Az9B+n4PXb3kEvZsS\nN2aS8x7ZAgMBAAECggEAGADFo50Edvg7pKy1JM8U8RIXDDR4V9n18ReXH+b6O3RC\nzzDCmH5ItS2UfI5VcwrZ1ZkGnPWcIVK2rIs9DT6IdDVYrSpKaxzQ0Dddf3VnutQG\nJ8Nyx2KFNH6f7Thgevw2YgD5PxR1jk1hTh35WSwZFwCpb7+ze1j1Vamdf0m5k9Az\nKDl2J44MibDend2LAmbyMVYOBXJb5JtOX9neUuqp5mE5dbOYFYqNaB9d20kMXe5m\nbHQ6jvLSxIdq5kwrq6tju0bqpiVACB298HymcVWeUIVVgbJ0twlcbK4PIB/poP1j\n1MJPdQ5vb82lGiPEiKb1FdGoSnQGmRJUzbEbW87pcwKBgQD/KH43MpGgRz3p0DQK\n/LYZyZZxyhNafJpk0MM9Wr/iXJk9aBL8zCCaQuU5li0GvxBD7zj9cNsI1ipKeqX5\nvTEmGblbNR5R/u1sGicorihAi7/eMNDi96vkx+juc8e/+uYWaY29qRuSP5pAX+7a\nDKp0QYvSLHxV9J+oIdX7Qa7tRwKBgQDhQj8OuTulVczWh4C+rj1WjkzxCcmC/F2w\nirVQJmMvNJ90jMMpEo32ykuk5iXUnGWt23h1RB39MKODPxNayo5Q1HCQJlWFHgZU\nuyZytqB4I6zDkMKLkBZXLfaZB9iRuvpXVJmolkjECEjYvOaQjwYvZZ/rwiO2Mid9\nZaH1+vki3wKBgH6yfqmt5H2vomCdT5o9DbcUUC3EZ4PA53Ez8B5hF3KxBC5npTX9\nrhqrKONFXKpC6TKycJv4E+r5XRqKeCvf8621jEJrx9hzOzU4b0VV5QrX2bfciXyJ\n+sKpOVJeD0uWq/VpCEaq19Pw3QkmGZYQP/tmKKV+DWcpBrYXxwbyAIg1AoGBAJtA\nXleWgS59yTUepTRGwM3UO+FxPmrB5wzTPQ3ltzyEx1W74pJ/UEsEuEgJu48iz82Y\n0xf3f7fOexPtODi+HIJHOOGRGiYqQHDLoD818bl71QngzsUD5PHnIuvsBW7DcOEZ\n1OHl2ncJwrNm1n5RpRCruSHzZ0uem6sIji0L8gP/AoGAVDI5CFa7Pb2GhYG2IAFq\ngC9FOHd/cU8yzku+Em7MLL/8ioiJpgWkbZ2znOyUgkVwK2YYOeScoEQGpzcvJBt6\neq2kuio6XnvRr6aYgfpFArYmVvrfI8yyJp80mAchVxVKO6SbPUwGlptwMJ0j//qf\nZsfjtg5KveBWOnVDru43GXs=\n-----END PRIVATE KEY-----\n";
});
