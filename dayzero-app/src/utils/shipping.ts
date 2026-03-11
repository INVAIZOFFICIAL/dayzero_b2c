/**
 * KSE Sagawa (Standard & Light) 배송비 계산 유틸리티
 * 
 * 보내주신 이미지의 테이블을 기준으로 구현합니다.
 * - 2.5kg 초과분은 0.5kg당 약 150엔 정도 증가하는 일반적인 해외 배송 패턴을 가정하거나 
 *   테이블의 마지막 값을 기준으로 익스텐션 합니다.
 */

interface ShippingRate {
    upToKg: number;
    standardYen: number; // KSE (SAGAWA) 기본 (가장 보수적인 값 사용)
    lightYen?: number;   // KSE Light (NEKOPOS) - 소형화물
}

const SHIPPING_RATES: ShippingRate[] = [
    { upToKg: 0.10, standardYen: 490, lightYen: 350 },
    { upToKg: 0.25, standardYen: 560, lightYen: 400 },
    { upToKg: 0.50, standardYen: 620, lightYen: 460 },
    { upToKg: 0.75, standardYen: 700, lightYen: 490 },
    { upToKg: 1.00, standardYen: 750, lightYen: 530 },
    { upToKg: 1.25, standardYen: 780 },
    { upToKg: 1.50, standardYen: 830 },
    { upToKg: 1.75, standardYen: 880 },
    { upToKg: 2.00, standardYen: 940 },
    { upToKg: 2.50, standardYen: 1090 },
];

/**
 * 무게(kg)에 따른 국제 배송비(JPY)를 계산합니다.
 * 가능한 경우 Light(소형) 요금을 우선 적용하고, 불가능하면 Standard 요금을 적용합니다.
 */
export const calculateIntlShippingJpy = (weightKg: number): number => {
    // 가장 적합한 구간 찾기
    const rate = SHIPPING_RATES.find(r => weightKg <= r.upToKg) || SHIPPING_RATES[SHIPPING_RATES.length - 1];

    // 1kg 이하이고 Light 요금이 있는 경우 Light 적용 (사용자 이득)
    if (weightKg <= 1.0 && rate.lightYen) {
        return rate.lightYen;
    }

    // 그 외에는 Standard 적용
    let basePrice = rate.standardYen;

    // 2.5kg 초과 시 초과 요금 시뮬레이션 (0.5kg당 150엔 추가)
    if (weightKg > 2.5) {
        const extraWeight = weightKg - 2.5;
        const extraUnits = Math.ceil(extraWeight / 0.5);
        basePrice += extraUnits * 150;
    }

    return basePrice;
};

/**
 * JPY 배송비를 KRW으로 변환 (환율 9배 가정 - 상품가와 동일한 기준)
 */
export const calculateIntlShippingKrw = (weightKg: number): number => {
    return calculateIntlShippingJpy(weightKg) * 9;
};
