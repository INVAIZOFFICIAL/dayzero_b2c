const W = 800;
const enc = (s: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(s)}`;

// ── 화장품 (Beauty) ─────────────────────────────────────────────────────────

const BEAUTY_KO_SVGS: string[] = [
    enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="400">
<rect width="${W}" height="400" fill="#ffffff"/>
<rect width="${W}" height="64" fill="#3182F6"/>
<text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">제품 소개</text>
<text x="40" y="114" font-family="sans-serif" font-size="20" font-weight="bold" fill="#191F28">토리든 다이브인 세럼 50ml</text>
<text x="40" y="158" font-family="sans-serif" font-size="15" fill="#4E5968">피부 속 깊은 곳까지 수분을 공급하는 하이알루로닉 세럼입니다.</text>
<text x="40" y="182" font-family="sans-serif" font-size="15" fill="#4E5968">심해수 히알루론산 5종으로 피부 수분 장벽을 강화하고</text>
<text x="40" y="206" font-family="sans-serif" font-size="15" fill="#4E5968">건조한 피부에 즉각적인 수분감을 선사합니다.</text>
<rect x="40" y="244" width="720" height="1" fill="#E5E8EB"/>
<text x="40" y="272" font-family="sans-serif" font-size="14" fill="#6B7684">용량 50ml</text>
<text x="140" y="272" font-family="sans-serif" font-size="14" fill="#CBD0D6">|</text>
<text x="160" y="272" font-family="sans-serif" font-size="14" fill="#6B7684">피부과 테스트 완료</text>
<text x="340" y="272" font-family="sans-serif" font-size="14" fill="#CBD0D6">|</text>
<text x="360" y="272" font-family="sans-serif" font-size="14" fill="#6B7684">무향 · 무알코올</text>
<text x="40" y="302" font-family="sans-serif" font-size="14" fill="#6B7684">전 피부 타입 사용 가능</text>
<rect x="40" y="330" width="120" height="36" rx="18" fill="#EFF6FF"/>
<text x="68" y="353" font-family="sans-serif" font-size="13" font-weight="bold" fill="#3182F6">비건 인증</text>
<rect x="172" y="330" width="152" height="36" rx="18" fill="#EFF6FF"/>
<text x="200" y="353" font-family="sans-serif" font-size="13" font-weight="bold" fill="#3182F6">무파라벤 처방</text>
<rect x="0" y="395" width="${W}" height="5" fill="#F2F4F6"/>
</svg>`),

    enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="440">
<rect width="${W}" height="440" fill="#ffffff"/>
<rect width="${W}" height="64" fill="#3182F6"/>
<text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">주요 성분</text>
<rect x="40" y="84" width="200" height="38" rx="8" fill="#EFF6FF"/>
<text x="60" y="108" font-family="sans-serif" font-size="14" font-weight="bold" fill="#3182F6">히알루론산 5종</text>
<text x="40" y="148" font-family="sans-serif" font-size="14" fill="#4E5968">다섯 가지 분자량의 히알루론산이 피부 층층이 수분을 공급합니다.</text>
<rect x="40" y="180" width="160" height="38" rx="8" fill="#EFF6FF"/>
<text x="60" y="204" font-family="sans-serif" font-size="14" font-weight="bold" fill="#3182F6">베타글루칸</text>
<text x="40" y="244" font-family="sans-serif" font-size="14" fill="#4E5968">피부 면역력을 높이고 자극받은 피부를 진정시킵니다.</text>
<rect x="40" y="276" width="120" height="38" rx="8" fill="#EFF6FF"/>
<text x="60" y="300" font-family="sans-serif" font-size="14" font-weight="bold" fill="#3182F6">판테놀</text>
<text x="40" y="340" font-family="sans-serif" font-size="14" fill="#4E5968">피부 재생을 도와주고 유·수분 밸런스를 맞춰줍니다.</text>
<rect x="40" y="372" width="140" height="38" rx="8" fill="#EFF6FF"/>
<text x="60" y="396" font-family="sans-serif" font-size="14" font-weight="bold" fill="#3182F6">나이아신아마이드</text>
<text x="40" y="430" font-family="sans-serif" font-size="14" fill="#4E5968">피부 톤을 고르게 하고 모공을 정돈합니다.</text>
<rect x="0" y="435" width="${W}" height="5" fill="#F2F4F6"/>
</svg>`),

    enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="360">
<rect width="${W}" height="360" fill="#ffffff"/>
<rect width="${W}" height="64" fill="#3182F6"/>
<text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">사용 방법</text>
<circle cx="64" cy="114" r="18" fill="#3182F6"/>
<text x="57" y="120" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">1</text>
<text x="96" y="120" font-family="sans-serif" font-size="15" fill="#191F28">세안 후 스킨으로 기본 피부 결을 정돈합니다.</text>
<circle cx="64" cy="174" r="18" fill="#3182F6"/>
<text x="57" y="180" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">2</text>
<text x="96" y="180" font-family="sans-serif" font-size="15" fill="#191F28">적당량(3~5방울)을 손에 덜어냅니다.</text>
<circle cx="64" cy="234" r="18" fill="#3182F6"/>
<text x="57" y="240" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">3</text>
<text x="96" y="240" font-family="sans-serif" font-size="15" fill="#191F28">얼굴 전체에 가볍게 두드리며 흡수시킵니다.</text>
<circle cx="64" cy="294" r="18" fill="#3182F6"/>
<text x="57" y="300" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">4</text>
<text x="96" y="300" font-family="sans-serif" font-size="15" fill="#191F28">에멀전 또는 크림으로 마무리합니다.</text>
<rect x="0" y="355" width="${W}" height="5" fill="#F2F4F6"/>
</svg>`),

    enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="320">
<rect width="${W}" height="320" fill="#ffffff"/>
<rect width="${W}" height="64" fill="#3182F6"/>
<text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">기대 효과</text>
<rect x="40" y="80" width="2" height="210" fill="#E5E8EB"/>
<circle cx="40" cy="108" r="6" fill="#3182F6"/>
<text x="62" y="113" font-family="sans-serif" font-size="15" fill="#191F28">즉각적인 수분 공급 — 바른 직후 촉촉함을 느낄 수 있습니다.</text>
<circle cx="40" cy="156" r="6" fill="#3182F6"/>
<text x="62" y="161" font-family="sans-serif" font-size="15" fill="#191F28">수분 장벽 강화 — 하루 종일 건조함 없이 촉촉한 피부.</text>
<circle cx="40" cy="204" r="6" fill="#3182F6"/>
<text x="62" y="209" font-family="sans-serif" font-size="15" fill="#191F28">피부 진정 — 외부 자극으로 붉어진 피부를 진정시킵니다.</text>
<circle cx="40" cy="252" r="6" fill="#3182F6"/>
<text x="62" y="257" font-family="sans-serif" font-size="15" fill="#191F28">피부 결 개선 — 꾸준한 사용으로 매끄러운 피부 결.</text>
<rect x="0" y="315" width="${W}" height="5" fill="#F2F4F6"/>
</svg>`),

    enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="310">
<rect width="${W}" height="310" fill="#ffffff"/>
<rect width="${W}" height="64" fill="#6B7684"/>
<text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">주의 사항</text>
<text x="40" y="104" font-family="sans-serif" font-size="14" fill="#4E5968">• 눈에 들어가지 않도록 주의하세요.</text>
<text x="40" y="130" font-family="sans-serif" font-size="14" fill="#4E5968">• 이상이 있을 경우 즉시 사용을 중단하고 전문의와 상담하세요.</text>
<text x="40" y="156" font-family="sans-serif" font-size="14" fill="#4E5968">• 어린이 손이 닿지 않는 곳에 보관하세요.</text>
<text x="40" y="182" font-family="sans-serif" font-size="14" fill="#4E5968">• 직사광선을 피하고 서늘한 곳에 보관하세요.</text>
<text x="40" y="208" font-family="sans-serif" font-size="14" fill="#4E5968">• 개봉 후 12개월 이내에 사용하세요.</text>
<rect x="40" y="244" width="720" height="1" fill="#E5E8EB"/>
<text x="40" y="272" font-family="sans-serif" font-size="13" fill="#8B95A1">제조사: (주)토리든 · 수입원: 데이제로 주식회사</text>
</svg>`),
];

const BEAUTY_JA_SVGS: string[] = [
    enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="400">
<rect width="${W}" height="400" fill="#ffffff"/>
<rect width="${W}" height="64" fill="#3182F6"/>
<text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">製品紹介</text>
<text x="40" y="114" font-family="sans-serif" font-size="20" font-weight="bold" fill="#191F28">TORRIDEN ダイブイン セラム 50ml</text>
<text x="40" y="158" font-family="sans-serif" font-size="15" fill="#4E5968">肌の奥深くまで水分を届けるヒアルロン酸セラムです。</text>
<text x="40" y="182" font-family="sans-serif" font-size="15" fill="#4E5968">5種のヒアルロン酸が肌の水分バリアを強化し、</text>
<text x="40" y="206" font-family="sans-serif" font-size="15" fill="#4E5968">乾燥した肌にすぐうるおいを与えます。</text>
<rect x="40" y="244" width="720" height="1" fill="#E5E8EB"/>
<text x="40" y="272" font-family="sans-serif" font-size="14" fill="#6B7684">容量 50ml</text>
<text x="140" y="272" font-family="sans-serif" font-size="14" fill="#CBD0D6">|</text>
<text x="160" y="272" font-family="sans-serif" font-size="14" fill="#6B7684">皮膚科テスト済み</text>
<text x="340" y="272" font-family="sans-serif" font-size="14" fill="#CBD0D6">|</text>
<text x="360" y="272" font-family="sans-serif" font-size="14" fill="#6B7684">無香料・ノンアルコール</text>
<text x="40" y="302" font-family="sans-serif" font-size="14" fill="#6B7684">全肌タイプ使用可能</text>
<rect x="40" y="330" width="120" height="36" rx="18" fill="#EFF6FF"/>
<text x="62" y="353" font-family="sans-serif" font-size="13" font-weight="bold" fill="#3182F6">ビーガン認証</text>
<rect x="172" y="330" width="180" height="36" rx="18" fill="#EFF6FF"/>
<text x="196" y="353" font-family="sans-serif" font-size="13" font-weight="bold" fill="#3182F6">パラベンフリー処方</text>
<rect x="0" y="395" width="${W}" height="5" fill="#F2F4F6"/>
</svg>`),

    enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="440">
<rect width="${W}" height="440" fill="#ffffff"/>
<rect width="${W}" height="64" fill="#3182F6"/>
<text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">主要成分</text>
<rect x="40" y="84" width="220" height="38" rx="8" fill="#EFF6FF"/>
<text x="60" y="108" font-family="sans-serif" font-size="14" font-weight="bold" fill="#3182F6">ヒアルロン酸 5種</text>
<text x="40" y="148" font-family="sans-serif" font-size="14" fill="#4E5968">5種の分子量のヒアルロン酸が肌の層ごとに水分を補給します。</text>
<rect x="40" y="180" width="160" height="38" rx="8" fill="#EFF6FF"/>
<text x="60" y="204" font-family="sans-serif" font-size="14" font-weight="bold" fill="#3182F6">β-グルカン</text>
<text x="40" y="244" font-family="sans-serif" font-size="14" fill="#4E5968">肌の免疫力を高め、刺激を受けた肌を鎮静させます。</text>
<rect x="40" y="276" width="140" height="38" rx="8" fill="#EFF6FF"/>
<text x="60" y="300" font-family="sans-serif" font-size="14" font-weight="bold" fill="#3182F6">パンテノール</text>
<text x="40" y="340" font-family="sans-serif" font-size="14" fill="#4E5968">肌の再生を助け、油分と水分のバランスを整えます。</text>
<rect x="40" y="372" width="180" height="38" rx="8" fill="#EFF6FF"/>
<text x="60" y="396" font-family="sans-serif" font-size="14" font-weight="bold" fill="#3182F6">ナイアシンアミド</text>
<text x="40" y="430" font-family="sans-serif" font-size="14" fill="#4E5968">肌のトーンを均一にし、毛穴を整えます。</text>
<rect x="0" y="435" width="${W}" height="5" fill="#F2F4F6"/>
</svg>`),

    enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="360">
<rect width="${W}" height="360" fill="#ffffff"/>
<rect width="${W}" height="64" fill="#3182F6"/>
<text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">使用方法</text>
<circle cx="64" cy="114" r="18" fill="#3182F6"/>
<text x="57" y="120" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">1</text>
<text x="96" y="120" font-family="sans-serif" font-size="15" fill="#191F28">洗顔後、化粧水で肌のキメを整えます。</text>
<circle cx="64" cy="174" r="18" fill="#3182F6"/>
<text x="57" y="180" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">2</text>
<text x="96" y="180" font-family="sans-serif" font-size="15" fill="#191F28">適量（3〜5滴）を手のひらに取ります。</text>
<circle cx="64" cy="234" r="18" fill="#3182F6"/>
<text x="57" y="240" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">3</text>
<text x="96" y="240" font-family="sans-serif" font-size="15" fill="#191F28">顔全体に優しくなじませ、吸収させます。</text>
<circle cx="64" cy="294" r="18" fill="#3182F6"/>
<text x="57" y="300" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">4</text>
<text x="96" y="300" font-family="sans-serif" font-size="15" fill="#191F28">乳液またはクリームで仕上げます。</text>
<rect x="0" y="355" width="${W}" height="5" fill="#F2F4F6"/>
</svg>`),

    enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="320">
<rect width="${W}" height="320" fill="#ffffff"/>
<rect width="${W}" height="64" fill="#3182F6"/>
<text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">期待される効果</text>
<rect x="40" y="80" width="2" height="210" fill="#E5E8EB"/>
<circle cx="40" cy="108" r="6" fill="#3182F6"/>
<text x="62" y="113" font-family="sans-serif" font-size="15" fill="#191F28">即時保湿 — 塗った直後にしっとり感を実感できます。</text>
<circle cx="40" cy="156" r="6" fill="#3182F6"/>
<text x="62" y="161" font-family="sans-serif" font-size="15" fill="#191F28">水分バリア強化 — 一日中乾燥知らずのうるおい肌。</text>
<circle cx="40" cy="204" r="6" fill="#3182F6"/>
<text x="62" y="209" font-family="sans-serif" font-size="15" fill="#191F28">肌鎮静 — 外部刺激で赤くなった肌を落ち着かせます。</text>
<circle cx="40" cy="252" r="6" fill="#3182F6"/>
<text x="62" y="257" font-family="sans-serif" font-size="15" fill="#191F28">キメ改善 — 継続使用でなめらかな肌へ。</text>
<rect x="0" y="315" width="${W}" height="5" fill="#F2F4F6"/>
</svg>`),

    enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="310">
<rect width="${W}" height="310" fill="#ffffff"/>
<rect width="${W}" height="64" fill="#6B7684"/>
<text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">使用上の注意</text>
<text x="40" y="104" font-family="sans-serif" font-size="14" fill="#4E5968">• 目に入らないようにご注意ください。</text>
<text x="40" y="130" font-family="sans-serif" font-size="14" fill="#4E5968">• 異常が生じた場合は使用を中止し、専門医にご相談ください。</text>
<text x="40" y="156" font-family="sans-serif" font-size="14" fill="#4E5968">• お子様の手の届かない場所に保管してください。</text>
<text x="40" y="182" font-family="sans-serif" font-size="14" fill="#4E5968">• 直射日光を避け、冷暗所に保管してください。</text>
<text x="40" y="208" font-family="sans-serif" font-size="14" fill="#4E5968">• 開封後12ヶ月以内にご使用ください。</text>
<rect x="40" y="244" width="720" height="1" fill="#E5E8EB"/>
<text x="40" y="272" font-family="sans-serif" font-size="13" fill="#8B95A1">製造元: TORRIDEN Co., Ltd. · 輸入元: DayZero Inc.</text>
</svg>`),
];

// ── 케이팝 (K-Pop) ──────────────────────────────────────────────────────────

const KPOP_KO_SVGS: string[] = [
    enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="420">
<rect width="${W}" height="420" fill="#0F0A1E"/>
<rect width="${W}" height="64" fill="#7C3AED"/>
<text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">앨범 소개</text>
<text x="40" y="116" font-family="sans-serif" font-size="20" font-weight="bold" fill="#ffffff">뉴진스 (NewJeans)</text>
<text x="40" y="150" font-family="sans-serif" font-size="24" font-weight="bold" fill="#C4B5FD">2nd EP「Get Up」</text>
<text x="40" y="196" font-family="sans-serif" font-size="14" fill="#A78BFA">아티스트</text>
<text x="140" y="196" font-family="sans-serif" font-size="14" fill="#E9D5FF">NewJeans (뉴진스)</text>
<text x="40" y="222" font-family="sans-serif" font-size="14" fill="#A78BFA">발매일</text>
<text x="140" y="222" font-family="sans-serif" font-size="14" fill="#E9D5FF">2023년 7월 21일</text>
<text x="40" y="248" font-family="sans-serif" font-size="14" fill="#A78BFA">앨범 유형</text>
<text x="140" y="248" font-family="sans-serif" font-size="14" fill="#E9D5FF">미니 앨범 (EP) · 6트랙</text>
<text x="40" y="274" font-family="sans-serif" font-size="14" fill="#A78BFA">버전</text>
<text x="140" y="274" font-family="sans-serif" font-size="14" fill="#E9D5FF">Bunny Beach Bag ver.</text>
<rect x="40" y="308" width="720" height="1" fill="#2D1B6B"/>
<rect x="40" y="328" width="150" height="34" rx="17" fill="#3B1F7A"/>
<text x="64" y="350" font-family="sans-serif" font-size="13" font-weight="bold" fill="#C4B5FD">공식 정품 앨범</text>
<rect x="204" y="328" width="150" height="34" rx="17" fill="#3B1F7A"/>
<text x="224" y="350" font-family="sans-serif" font-size="13" font-weight="bold" fill="#C4B5FD">HYBE 공식 유통</text>
<rect x="368" y="328" width="150" height="34" rx="17" fill="#3B1F7A"/>
<text x="386" y="350" font-family="sans-serif" font-size="13" font-weight="bold" fill="#C4B5FD">한정 특전 포함</text>
<rect x="0" y="415" width="${W}" height="5" fill="#1E0F47"/>
</svg>`),

    enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="460">
<rect width="${W}" height="460" fill="#0F0A1E"/>
<rect width="${W}" height="64" fill="#7C3AED"/>
<text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">트랙리스트</text>
<text x="40" y="98" font-family="sans-serif" font-size="12" fill="#A78BFA">TRACK LIST · 총 6곡</text>
<rect x="40" y="118" width="720" height="52" rx="8" fill="#1A0F35"/>
<text x="68" y="149" font-family="sans-serif" font-size="15" font-weight="bold" fill="#C4B5FD">01</text>
<text x="106" y="149" font-family="sans-serif" font-size="15" fill="#ffffff">ETA</text>
<text x="700" y="149" font-family="sans-serif" font-size="13" fill="#6B7684">3:12</text>
<rect x="40" y="178" width="720" height="52" rx="8" fill="#170D2F"/>
<text x="68" y="209" font-family="sans-serif" font-size="15" font-weight="bold" fill="#A78BFA">02</text>
<text x="106" y="209" font-family="sans-serif" font-size="15" fill="#E9D5FF">Cool With You</text>
<text x="700" y="209" font-family="sans-serif" font-size="13" fill="#6B7684">3:08</text>
<rect x="40" y="238" width="720" height="52" rx="8" fill="#1A0F35"/>
<text x="68" y="269" font-family="sans-serif" font-size="15" font-weight="bold" fill="#C4B5FD">03</text>
<text x="106" y="269" font-family="sans-serif" font-size="15" fill="#ffffff">Get Up</text>
<text x="700" y="269" font-family="sans-serif" font-size="13" fill="#6B7684">2:58</text>
<rect x="40" y="298" width="720" height="52" rx="8" fill="#170D2F"/>
<text x="68" y="329" font-family="sans-serif" font-size="15" font-weight="bold" fill="#A78BFA">04</text>
<text x="106" y="329" font-family="sans-serif" font-size="15" fill="#E9D5FF">Super Shy</text>
<text x="700" y="329" font-family="sans-serif" font-size="13" fill="#6B7684">2:55</text>
<rect x="40" y="358" width="720" height="52" rx="8" fill="#1A0F35"/>
<text x="68" y="389" font-family="sans-serif" font-size="15" font-weight="bold" fill="#C4B5FD">05</text>
<text x="106" y="389" font-family="sans-serif" font-size="15" fill="#ffffff">New Jeans</text>
<text x="700" y="389" font-family="sans-serif" font-size="13" fill="#6B7684">3:21</text>
<rect x="40" y="418" width="720" height="52" rx="8" fill="#170D2F"/>
<text x="68" y="449" font-family="sans-serif" font-size="15" font-weight="bold" fill="#A78BFA">06</text>
<text x="106" y="449" font-family="sans-serif" font-size="15" fill="#E9D5FF">ASAP</text>
<text x="700" y="449" font-family="sans-serif" font-size="13" fill="#6B7684">3:04</text>
<rect x="0" y="455" width="${W}" height="5" fill="#1E0F47"/>
</svg>`),

    enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="400">
<rect width="${W}" height="400" fill="#0F0A1E"/>
<rect width="${W}" height="64" fill="#7C3AED"/>
<text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">구성품 안내</text>
<rect x="40" y="84" width="340" height="100" rx="10" fill="#1A0F35"/>
<text x="60" y="116" font-family="sans-serif" font-size="14" font-weight="bold" fill="#C4B5FD">포토북</text>
<text x="60" y="140" font-family="sans-serif" font-size="13" fill="#A78BFA">고화질 아트북 · 100p</text>
<text x="60" y="162" font-family="sans-serif" font-size="13" fill="#6B7684">랜덤 1종 포함</text>
<rect x="400" y="84" width="340" height="100" rx="10" fill="#1A0F35"/>
<text x="420" y="116" font-family="sans-serif" font-size="14" font-weight="bold" fill="#C4B5FD">포토카드</text>
<text x="420" y="140" font-family="sans-serif" font-size="13" fill="#A78BFA">멤버 개인 포토카드 5종</text>
<text x="420" y="162" font-family="sans-serif" font-size="13" fill="#6B7684">랜덤 1종 포함</text>
<rect x="40" y="204" width="340" height="100" rx="10" fill="#1A0F35"/>
<text x="60" y="236" font-family="sans-serif" font-size="14" font-weight="bold" fill="#C4B5FD">CD</text>
<text x="60" y="260" font-family="sans-serif" font-size="13" fill="#A78BFA">6트랙 수록 CD 1장</text>
<text x="60" y="282" font-family="sans-serif" font-size="13" fill="#6B7684">고음질 마스터링</text>
<rect x="400" y="204" width="340" height="100" rx="10" fill="#1A0F35"/>
<text x="420" y="236" font-family="sans-serif" font-size="14" font-weight="bold" fill="#C4B5FD">가방 패키지</text>
<text x="420" y="260" font-family="sans-serif" font-size="13" fill="#A78BFA">비치백 스타일 패키지</text>
<text x="420" y="282" font-family="sans-serif" font-size="13" fill="#6B7684">한정판 디자인</text>
<rect x="0" y="395" width="${W}" height="5" fill="#1E0F47"/>
</svg>`),

    enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="360">
<rect width="${W}" height="360" fill="#0F0A1E"/>
<rect width="${W}" height="64" fill="#7C3AED"/>
<text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">포토카드 안내</text>
<text x="40" y="100" font-family="sans-serif" font-size="15" fill="#E9D5FF">총 5종 랜덤 1종 봉입 · 멤버별 개인 포토카드</text>
<rect x="40" y="120" width="130" height="160" rx="8" fill="#1A0F35"/>
<text x="80" y="208" font-family="sans-serif" font-size="13" fill="#C4B5FD">민지</text>
<rect x="184" y="120" width="130" height="160" rx="8" fill="#1A0F35"/>
<text x="224" y="208" font-family="sans-serif" font-size="13" fill="#C4B5FD">하니</text>
<rect x="328" y="120" width="130" height="160" rx="8" fill="#1A0F35"/>
<text x="368" y="208" font-family="sans-serif" font-size="13" fill="#C4B5FD">다니엘</text>
<rect x="472" y="120" width="130" height="160" rx="8" fill="#1A0F35"/>
<text x="512" y="208" font-family="sans-serif" font-size="13" fill="#C4B5FD">해린</text>
<rect x="616" y="120" width="130" height="160" rx="8" fill="#1A0F35"/>
<text x="656" y="208" font-family="sans-serif" font-size="13" fill="#C4B5FD">혜인</text>
<text x="40" y="312" font-family="sans-serif" font-size="13" fill="#6B7684">※ 포토카드는 랜덤 발송으로, 원하는 멤버 지정이 불가합니다.</text>
<text x="40" y="336" font-family="sans-serif" font-size="13" fill="#6B7684">※ 교환 및 반품 불가 (랜덤 특성상)</text>
<rect x="0" y="355" width="${W}" height="5" fill="#1E0F47"/>
</svg>`),

    enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="310">
<rect width="${W}" height="310" fill="#0F0A1E"/>
<rect width="${W}" height="64" fill="#4B5563"/>
<text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">주의 사항</text>
<text x="40" y="104" font-family="sans-serif" font-size="14" fill="#9CA3AF">• 본 상품은 공식 정품이며 복제 및 재판매를 금합니다.</text>
<text x="40" y="130" font-family="sans-serif" font-size="14" fill="#9CA3AF">• 내부 구성품은 랜덤 발송으로 선택이 불가합니다.</text>
<text x="40" y="156" font-family="sans-serif" font-size="14" fill="#9CA3AF">• 배송 중 파손 방지를 위해 완충재 포장으로 발송됩니다.</text>
<text x="40" y="182" font-family="sans-serif" font-size="14" fill="#9CA3AF">• 개봉 후 단순 변심에 의한 반품은 불가합니다.</text>
<text x="40" y="208" font-family="sans-serif" font-size="14" fill="#9CA3AF">• CD 재생 시 스크래치가 생기지 않도록 주의하세요.</text>
<rect x="40" y="244" width="720" height="1" fill="#1F1740"/>
<text x="40" y="272" font-family="sans-serif" font-size="13" fill="#6B7280">공식 판매원: HYBE · 수입원: 데이제로 주식회사</text>
</svg>`),
];

const KPOP_JA_SVGS: string[] = [
    enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="420">
<rect width="${W}" height="420" fill="#0F0A1E"/>
<rect width="${W}" height="64" fill="#7C3AED"/>
<text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">アルバム紹介</text>
<text x="40" y="116" font-family="sans-serif" font-size="20" font-weight="bold" fill="#ffffff">NewJeans (ニュージーンズ)</text>
<text x="40" y="150" font-family="sans-serif" font-size="24" font-weight="bold" fill="#C4B5FD">2nd EP「Get Up」</text>
<text x="40" y="196" font-family="sans-serif" font-size="14" fill="#A78BFA">アーティスト</text>
<text x="160" y="196" font-family="sans-serif" font-size="14" fill="#E9D5FF">NewJeans (ニュージーンズ)</text>
<text x="40" y="222" font-family="sans-serif" font-size="14" fill="#A78BFA">発売日</text>
<text x="160" y="222" font-family="sans-serif" font-size="14" fill="#E9D5FF">2023年7月21日</text>
<text x="40" y="248" font-family="sans-serif" font-size="14" fill="#A78BFA">アルバム種類</text>
<text x="160" y="248" font-family="sans-serif" font-size="14" fill="#E9D5FF">ミニアルバム (EP) · 6トラック</text>
<text x="40" y="274" font-family="sans-serif" font-size="14" fill="#A78BFA">バージョン</text>
<text x="160" y="274" font-family="sans-serif" font-size="14" fill="#E9D5FF">Bunny Beach Bag ver.</text>
<rect x="40" y="308" width="720" height="1" fill="#2D1B6B"/>
<rect x="40" y="328" width="170" height="34" rx="17" fill="#3B1F7A"/>
<text x="58" y="350" font-family="sans-serif" font-size="13" font-weight="bold" fill="#C4B5FD">公式正規アルバム</text>
<rect x="224" y="328" width="170" height="34" rx="17" fill="#3B1F7A"/>
<text x="240" y="350" font-family="sans-serif" font-size="13" font-weight="bold" fill="#C4B5FD">HYBE公式流通品</text>
<rect x="408" y="328" width="150" height="34" rx="17" fill="#3B1F7A"/>
<text x="424" y="350" font-family="sans-serif" font-size="13" font-weight="bold" fill="#C4B5FD">限定特典付き</text>
<rect x="0" y="415" width="${W}" height="5" fill="#1E0F47"/>
</svg>`),

    enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="460">
<rect width="${W}" height="460" fill="#0F0A1E"/>
<rect width="${W}" height="64" fill="#7C3AED"/>
<text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">トラックリスト</text>
<text x="40" y="98" font-family="sans-serif" font-size="12" fill="#A78BFA">TRACK LIST · 全6曲</text>
<rect x="40" y="118" width="720" height="52" rx="8" fill="#1A0F35"/>
<text x="68" y="149" font-family="sans-serif" font-size="15" font-weight="bold" fill="#C4B5FD">01</text>
<text x="106" y="149" font-family="sans-serif" font-size="15" fill="#ffffff">ETA</text>
<text x="700" y="149" font-family="sans-serif" font-size="13" fill="#6B7684">3:12</text>
<rect x="40" y="178" width="720" height="52" rx="8" fill="#170D2F"/>
<text x="68" y="209" font-family="sans-serif" font-size="15" font-weight="bold" fill="#A78BFA">02</text>
<text x="106" y="209" font-family="sans-serif" font-size="15" fill="#E9D5FF">Cool With You</text>
<text x="700" y="209" font-family="sans-serif" font-size="13" fill="#6B7684">3:08</text>
<rect x="40" y="238" width="720" height="52" rx="8" fill="#1A0F35"/>
<text x="68" y="269" font-family="sans-serif" font-size="15" font-weight="bold" fill="#C4B5FD">03</text>
<text x="106" y="269" font-family="sans-serif" font-size="15" fill="#ffffff">Get Up</text>
<text x="700" y="269" font-family="sans-serif" font-size="13" fill="#6B7684">2:58</text>
<rect x="40" y="298" width="720" height="52" rx="8" fill="#170D2F"/>
<text x="68" y="329" font-family="sans-serif" font-size="15" font-weight="bold" fill="#A78BFA">04</text>
<text x="106" y="329" font-family="sans-serif" font-size="15" fill="#E9D5FF">Super Shy</text>
<text x="700" y="329" font-family="sans-serif" font-size="13" fill="#6B7684">2:55</text>
<rect x="40" y="358" width="720" height="52" rx="8" fill="#1A0F35"/>
<text x="68" y="389" font-family="sans-serif" font-size="15" font-weight="bold" fill="#C4B5FD">05</text>
<text x="106" y="389" font-family="sans-serif" font-size="15" fill="#ffffff">New Jeans</text>
<text x="700" y="389" font-family="sans-serif" font-size="13" fill="#6B7684">3:21</text>
<rect x="40" y="418" width="720" height="52" rx="8" fill="#170D2F"/>
<text x="68" y="449" font-family="sans-serif" font-size="15" font-weight="bold" fill="#A78BFA">06</text>
<text x="106" y="449" font-family="sans-serif" font-size="15" fill="#E9D5FF">ASAP</text>
<text x="700" y="449" font-family="sans-serif" font-size="13" fill="#6B7684">3:04</text>
<rect x="0" y="455" width="${W}" height="5" fill="#1E0F47"/>
</svg>`),

    enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="400">
<rect width="${W}" height="400" fill="#0F0A1E"/>
<rect width="${W}" height="64" fill="#7C3AED"/>
<text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">同梱品案内</text>
<rect x="40" y="84" width="340" height="100" rx="10" fill="#1A0F35"/>
<text x="60" y="116" font-family="sans-serif" font-size="14" font-weight="bold" fill="#C4B5FD">フォトブック</text>
<text x="60" y="140" font-family="sans-serif" font-size="13" fill="#A78BFA">高画質アートブック · 100p</text>
<text x="60" y="162" font-family="sans-serif" font-size="13" fill="#6B7684">ランダム1種封入</text>
<rect x="400" y="84" width="340" height="100" rx="10" fill="#1A0F35"/>
<text x="420" y="116" font-family="sans-serif" font-size="14" font-weight="bold" fill="#C4B5FD">フォトカード</text>
<text x="420" y="140" font-family="sans-serif" font-size="13" fill="#A78BFA">メンバー個別フォトカード5種</text>
<text x="420" y="162" font-family="sans-serif" font-size="13" fill="#6B7684">ランダム1種封入</text>
<rect x="40" y="204" width="340" height="100" rx="10" fill="#1A0F35"/>
<text x="60" y="236" font-family="sans-serif" font-size="14" font-weight="bold" fill="#C4B5FD">CD</text>
<text x="60" y="260" font-family="sans-serif" font-size="13" fill="#A78BFA">6トラック収録CD 1枚</text>
<text x="60" y="282" font-family="sans-serif" font-size="13" fill="#6B7684">ハイクオリティマスタリング</text>
<rect x="400" y="204" width="340" height="100" rx="10" fill="#1A0F35"/>
<text x="420" y="236" font-family="sans-serif" font-size="14" font-weight="bold" fill="#C4B5FD">バッグパッケージ</text>
<text x="420" y="260" font-family="sans-serif" font-size="13" fill="#A78BFA">ビーチバッグスタイル</text>
<text x="420" y="282" font-family="sans-serif" font-size="13" fill="#6B7684">限定デザイン</text>
<rect x="0" y="395" width="${W}" height="5" fill="#1E0F47"/>
</svg>`),

    enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="360">
<rect width="${W}" height="360" fill="#0F0A1E"/>
<rect width="${W}" height="64" fill="#7C3AED"/>
<text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">フォトカード案内</text>
<text x="40" y="100" font-family="sans-serif" font-size="15" fill="#E9D5FF">全5種ランダム1種封入 · メンバー個別フォトカード</text>
<rect x="40" y="120" width="130" height="160" rx="8" fill="#1A0F35"/>
<text x="80" y="208" font-family="sans-serif" font-size="13" fill="#C4B5FD">ミンジ</text>
<rect x="184" y="120" width="130" height="160" rx="8" fill="#1A0F35"/>
<text x="224" y="208" font-family="sans-serif" font-size="13" fill="#C4B5FD">ハニ</text>
<rect x="328" y="120" width="130" height="160" rx="8" fill="#1A0F35"/>
<text x="360" y="208" font-family="sans-serif" font-size="13" fill="#C4B5FD">ダニエル</text>
<rect x="472" y="120" width="130" height="160" rx="8" fill="#1A0F35"/>
<text x="508" y="208" font-family="sans-serif" font-size="13" fill="#C4B5FD">ヘリン</text>
<rect x="616" y="120" width="130" height="160" rx="8" fill="#1A0F35"/>
<text x="652" y="208" font-family="sans-serif" font-size="13" fill="#C4B5FD">ヘイン</text>
<text x="40" y="312" font-family="sans-serif" font-size="13" fill="#6B7280">※ フォトカードはランダム発送のため、メンバー指定は不可です。</text>
<text x="40" y="336" font-family="sans-serif" font-size="13" fill="#6B7280">※ ランダム性のため、交換・返品は承れません。</text>
<rect x="0" y="355" width="${W}" height="5" fill="#1E0F47"/>
</svg>`),

    enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="310">
<rect width="${W}" height="310" fill="#0F0A1E"/>
<rect width="${W}" height="64" fill="#4B5563"/>
<text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">ご注意事項</text>
<text x="40" y="104" font-family="sans-serif" font-size="14" fill="#9CA3AF">• 本商品は公式正規品です。複製・転売を禁止します。</text>
<text x="40" y="130" font-family="sans-serif" font-size="14" fill="#9CA3AF">• 同梱品はランダム発送のため、選択はできません。</text>
<text x="40" y="156" font-family="sans-serif" font-size="14" fill="#9CA3AF">• 配送中の破損防止のため、緩衝材で梱包してお届けします。</text>
<text x="40" y="182" font-family="sans-serif" font-size="14" fill="#9CA3AF">• 開封後の単純な気変わりによる返品は承れません。</text>
<text x="40" y="208" font-family="sans-serif" font-size="14" fill="#9CA3AF">• CDの再生時に傷が付かないようご注意ください。</text>
<rect x="40" y="244" width="720" height="1" fill="#1F1740"/>
<text x="40" y="272" font-family="sans-serif" font-size="13" fill="#6B7280">販売元: HYBE · 輸入元: DayZero Inc.</text>
</svg>`),
];

// ── 생활용품 (Daily Goods) ──────────────────────────────────────────────────

const DAILY_KO_SVGS: string[] = [
    enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="400">
<rect width="${W}" height="400" fill="#ffffff"/>
<rect width="${W}" height="64" fill="#16A34A"/>
<text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">제품 특징</text>
<text x="40" y="112" font-family="sans-serif" font-size="20" font-weight="bold" fill="#191F28">락앤락 클리어비 밀폐용기 8p 세트</text>
<text x="40" y="150" font-family="sans-serif" font-size="15" fill="#4E5968">프리미엄 트라이탄 소재로 투명하고 가볍게,</text>
<text x="40" y="174" font-family="sans-serif" font-size="15" fill="#4E5968">사방 4면 잠금으로 완벽한 밀폐력을 자랑합니다.</text>
<rect x="40" y="210" width="720" height="1" fill="#E5E8EB"/>
<rect x="40" y="230" width="154" height="80" rx="10" fill="#F0FDF4"/>
<text x="60" y="262" font-family="sans-serif" font-size="13" font-weight="bold" fill="#16A34A">내열 내냉 설계</text>
<text x="60" y="284" font-family="sans-serif" font-size="12" fill="#4E5968">-20°C ~ 120°C</text>
<rect x="210" y="230" width="154" height="80" rx="10" fill="#F0FDF4"/>
<text x="230" y="262" font-family="sans-serif" font-size="13" font-weight="bold" fill="#16A34A">4면 잠금 구조</text>
<text x="230" y="284" font-family="sans-serif" font-size="12" fill="#4E5968">완벽 밀폐 보장</text>
<rect x="380" y="230" width="154" height="80" rx="10" fill="#F0FDF4"/>
<text x="400" y="262" font-family="sans-serif" font-size="13" font-weight="bold" fill="#16A34A">환경호르몬 無</text>
<text x="400" y="284" font-family="sans-serif" font-size="12" fill="#4E5968">BPA Free 인증</text>
<rect x="550" y="230" width="154" height="80" rx="10" fill="#F0FDF4"/>
<text x="570" y="262" font-family="sans-serif" font-size="13" font-weight="bold" fill="#16A34A">식기세척기 OK</text>
<text x="570" y="284" font-family="sans-serif" font-size="12" fill="#4E5968">전자레인지 사용 가능</text>
<text x="40" y="356" font-family="sans-serif" font-size="14" fill="#6B7684">냉장 · 냉동 · 전자레인지 · 식기세척기 모두 사용 가능한 올인원 용기입니다.</text>
<rect x="0" y="395" width="${W}" height="5" fill="#F2F4F6"/>
</svg>`),

    enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="380">
<rect width="${W}" height="380" fill="#ffffff"/>
<rect width="${W}" height="64" fill="#16A34A"/>
<text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">사양 안내</text>
<rect x="40" y="80" width="720" height="48" rx="0" fill="#F0FDF4"/>
<text x="60" y="111" font-family="sans-serif" font-size="14" font-weight="bold" fill="#15803D">구성</text>
<text x="200" y="111" font-family="sans-serif" font-size="14" fill="#191F28">정사각 대 × 2 · 정사각 중 × 2 · 직사각 × 2 · 소형 × 2</text>
<rect x="40" y="128" width="720" height="48" rx="0" fill="#ffffff"/>
<text x="60" y="159" font-family="sans-serif" font-size="14" font-weight="bold" fill="#15803D">소재</text>
<text x="200" y="159" font-family="sans-serif" font-size="14" fill="#191F28">본체 트라이탄 · 뚜껑 PP (폴리프로필렌)</text>
<rect x="40" y="176" width="720" height="48" rx="0" fill="#F0FDF4"/>
<text x="60" y="207" font-family="sans-serif" font-size="14" font-weight="bold" fill="#15803D">내열 온도</text>
<text x="200" y="207" font-family="sans-serif" font-size="14" fill="#191F28">-20°C ~ 120°C (뚜껑 제외 전자레인지 사용)</text>
<rect x="40" y="224" width="720" height="48" rx="0" fill="#ffffff"/>
<text x="60" y="255" font-family="sans-serif" font-size="14" font-weight="bold" fill="#15803D">용량</text>
<text x="200" y="255" font-family="sans-serif" font-size="14" fill="#191F28">0.35L / 0.7L / 1.0L / 1.8L (4가지)</text>
<rect x="40" y="272" width="720" height="48" rx="0" fill="#F0FDF4"/>
<text x="60" y="303" font-family="sans-serif" font-size="14" font-weight="bold" fill="#15803D">인증</text>
<text x="200" y="303" font-family="sans-serif" font-size="14" fill="#191F28">BPA Free · KC 인증 · 식품용기 적합</text>
<rect x="40" y="320" width="720" height="48" rx="0" fill="#ffffff"/>
<text x="60" y="351" font-family="sans-serif" font-size="14" font-weight="bold" fill="#15803D">원산지</text>
<text x="200" y="351" font-family="sans-serif" font-size="14" fill="#191F28">대한민국 (Made in Korea)</text>
<rect x="0" y="375" width="${W}" height="5" fill="#F2F4F6"/>
</svg>`),

    enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="360">
<rect width="${W}" height="360" fill="#ffffff"/>
<rect width="${W}" height="64" fill="#16A34A"/>
<text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">사용 방법</text>
<circle cx="64" cy="114" r="18" fill="#16A34A"/>
<text x="57" y="120" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">1</text>
<text x="96" y="120" font-family="sans-serif" font-size="15" fill="#191F28">처음 사용 전 세제로 깨끗이 세척 후 사용하세요.</text>
<circle cx="64" cy="174" r="18" fill="#16A34A"/>
<text x="57" y="180" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">2</text>
<text x="96" y="180" font-family="sans-serif" font-size="15" fill="#191F28">식품을 담고 뚜껑을 덮은 후 4면 클립을 눌러 잠금합니다.</text>
<circle cx="64" cy="234" r="18" fill="#16A34A"/>
<text x="57" y="240" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">3</text>
<text x="96" y="240" font-family="sans-serif" font-size="15" fill="#191F28">전자레인지 사용 시 뚜껑을 분리하거나 살짝 열어두세요.</text>
<circle cx="64" cy="294" r="18" fill="#16A34A"/>
<text x="57" y="300" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">4</text>
<text x="96" y="300" font-family="sans-serif" font-size="15" fill="#191F28">식기세척기 사용 가능. 상단 선반 권장합니다.</text>
<rect x="0" y="355" width="${W}" height="5" fill="#F2F4F6"/>
</svg>`),

    enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="300">
<rect width="${W}" height="300" fill="#ffffff"/>
<rect width="${W}" height="64" fill="#16A34A"/>
<text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">구성품</text>
<text x="40" y="104" font-family="sans-serif" font-size="15" fill="#4E5968">총 8개 구성 · 다양한 사이즈로 냉장·냉동 모두 활용 가능</text>
<rect x="40" y="124" width="2" height="140" fill="#E5E8EB"/>
<circle cx="40" cy="148" r="5" fill="#16A34A"/>
<text x="60" y="153" font-family="sans-serif" font-size="14" fill="#191F28">정사각 대 (1.8L) × 2개 — 반찬, 나물류 보관용</text>
<circle cx="40" cy="185" r="5" fill="#16A34A"/>
<text x="60" y="190" font-family="sans-serif" font-size="14" fill="#191F28">정사각 중 (1.0L) × 2개 — 과일, 견과류 보관용</text>
<circle cx="40" cy="222" r="5" fill="#16A34A"/>
<text x="60" y="227" font-family="sans-serif" font-size="14" fill="#191F28">직사각 (0.7L) × 2개 — 고기, 생선 냉동 보관용</text>
<circle cx="40" cy="259" r="5" fill="#16A34A"/>
<text x="60" y="264" font-family="sans-serif" font-size="14" fill="#191F28">소형 (0.35L) × 2개 — 소스, 드레싱 보관용</text>
<rect x="0" y="295" width="${W}" height="5" fill="#F2F4F6"/>
</svg>`),

    enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="300">
<rect width="${W}" height="300" fill="#ffffff"/>
<rect width="${W}" height="64" fill="#6B7684"/>
<text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">주의 사항</text>
<text x="40" y="102" font-family="sans-serif" font-size="14" fill="#4E5968">• 뚜껑을 닫은 채로 전자레인지 사용을 금지합니다.</text>
<text x="40" y="128" font-family="sans-serif" font-size="14" fill="#4E5968">• 직화, 오븐, 가스레인지 사용 불가합니다.</text>
<text x="40" y="154" font-family="sans-serif" font-size="14" fill="#4E5968">• 충격에 의해 파손될 수 있으니 주의하세요.</text>
<text x="40" y="180" font-family="sans-serif" font-size="14" fill="#4E5968">• 변색·변형 방지를 위해 기름진 음식 장기 보관을 삼가세요.</text>
<text x="40" y="206" font-family="sans-serif" font-size="14" fill="#4E5968">• 어린이 손이 닿지 않는 곳에 보관하세요.</text>
<rect x="40" y="240" width="720" height="1" fill="#E5E8EB"/>
<text x="40" y="268" font-family="sans-serif" font-size="13" fill="#8B95A1">제조사: (주)락앤락 · 수입원: 데이제로 주식회사</text>
</svg>`),
];

const DAILY_JA_SVGS: string[] = [
    enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="400">
<rect width="${W}" height="400" fill="#ffffff"/>
<rect width="${W}" height="64" fill="#16A34A"/>
<text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">製品の特徴</text>
<text x="40" y="112" font-family="sans-serif" font-size="20" font-weight="bold" fill="#191F28">ロック＆ロック クリアビ 密閉容器 8個セット</text>
<text x="40" y="150" font-family="sans-serif" font-size="15" fill="#4E5968">プレミアムトライタン素材で透明かつ軽量、</text>
<text x="40" y="174" font-family="sans-serif" font-size="15" fill="#4E5968">4面ロックで完璧な密閉力を実現しました。</text>
<rect x="40" y="210" width="720" height="1" fill="#E5E8EB"/>
<rect x="40" y="230" width="154" height="80" rx="10" fill="#F0FDF4"/>
<text x="54" y="262" font-family="sans-serif" font-size="13" font-weight="bold" fill="#16A34A">耐熱・耐冷設計</text>
<text x="54" y="284" font-family="sans-serif" font-size="12" fill="#4E5968">-20°C ~ 120°C</text>
<rect x="210" y="230" width="154" height="80" rx="10" fill="#F0FDF4"/>
<text x="224" y="262" font-family="sans-serif" font-size="13" font-weight="bold" fill="#16A34A">4面ロック構造</text>
<text x="224" y="284" font-family="sans-serif" font-size="12" fill="#4E5968">完全密閉を保証</text>
<rect x="380" y="230" width="154" height="80" rx="10" fill="#F0FDF4"/>
<text x="394" y="262" font-family="sans-serif" font-size="13" font-weight="bold" fill="#16A34A">環境ホルモンなし</text>
<text x="394" y="284" font-family="sans-serif" font-size="12" fill="#4E5968">BPA Free認証</text>
<rect x="550" y="230" width="154" height="80" rx="10" fill="#F0FDF4"/>
<text x="564" y="262" font-family="sans-serif" font-size="13" font-weight="bold" fill="#16A34A">食洗機対応</text>
<text x="564" y="284" font-family="sans-serif" font-size="12" fill="#4E5968">電子レンジ使用可</text>
<text x="40" y="356" font-family="sans-serif" font-size="14" fill="#6B7684">冷蔵・冷凍・電子レンジ・食洗機すべてに対応したオールインワン容器です。</text>
<rect x="0" y="395" width="${W}" height="5" fill="#F2F4F6"/>
</svg>`),

    enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="380">
<rect width="${W}" height="380" fill="#ffffff"/>
<rect width="${W}" height="64" fill="#16A34A"/>
<text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">仕様案内</text>
<rect x="40" y="80" width="720" height="48" rx="0" fill="#F0FDF4"/>
<text x="60" y="111" font-family="sans-serif" font-size="14" font-weight="bold" fill="#15803D">セット内容</text>
<text x="200" y="111" font-family="sans-serif" font-size="14" fill="#191F28">正方形大×2 · 正方形中×2 · 長方形×2 · 小型×2</text>
<rect x="40" y="128" width="720" height="48" rx="0" fill="#ffffff"/>
<text x="60" y="159" font-family="sans-serif" font-size="14" font-weight="bold" fill="#15803D">素材</text>
<text x="200" y="159" font-family="sans-serif" font-size="14" fill="#191F28">本体 トライタン · フタ PP (ポリプロピレン)</text>
<rect x="40" y="176" width="720" height="48" rx="0" fill="#F0FDF4"/>
<text x="60" y="207" font-family="sans-serif" font-size="14" font-weight="bold" fill="#15803D">耐熱温度</text>
<text x="200" y="207" font-family="sans-serif" font-size="14" fill="#191F28">-20°C ~ 120°C (フタを外して電子レンジ使用可)</text>
<rect x="40" y="224" width="720" height="48" rx="0" fill="#ffffff"/>
<text x="60" y="255" font-family="sans-serif" font-size="14" font-weight="bold" fill="#15803D">容量</text>
<text x="200" y="255" font-family="sans-serif" font-size="14" fill="#191F28">0.35L / 0.7L / 1.0L / 1.8L (4サイズ)</text>
<rect x="40" y="272" width="720" height="48" rx="0" fill="#F0FDF4"/>
<text x="60" y="303" font-family="sans-serif" font-size="14" font-weight="bold" fill="#15803D">認証</text>
<text x="200" y="303" font-family="sans-serif" font-size="14" fill="#191F28">BPA Free · KC認証 · 食品容器適合</text>
<rect x="40" y="320" width="720" height="48" rx="0" fill="#ffffff"/>
<text x="60" y="351" font-family="sans-serif" font-size="14" font-weight="bold" fill="#15803D">原産国</text>
<text x="200" y="351" font-family="sans-serif" font-size="14" fill="#191F28">大韓民国 (Made in Korea)</text>
<rect x="0" y="375" width="${W}" height="5" fill="#F2F4F6"/>
</svg>`),

    enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="360">
<rect width="${W}" height="360" fill="#ffffff"/>
<rect width="${W}" height="64" fill="#16A34A"/>
<text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">使用方法</text>
<circle cx="64" cy="114" r="18" fill="#16A34A"/>
<text x="57" y="120" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">1</text>
<text x="96" y="120" font-family="sans-serif" font-size="15" fill="#191F28">初めて使用する前に洗剤でよく洗ってから使用してください。</text>
<circle cx="64" cy="174" r="18" fill="#16A34A"/>
<text x="57" y="180" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">2</text>
<text x="96" y="180" font-family="sans-serif" font-size="15" fill="#191F28">食品を入れてフタを閉め、4面のクリップを押してロックします。</text>
<circle cx="64" cy="234" r="18" fill="#16A34A"/>
<text x="57" y="240" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">3</text>
<text x="96" y="240" font-family="sans-serif" font-size="15" fill="#191F28">電子レンジ使用時はフタを外すか、少し開けて使用してください。</text>
<circle cx="64" cy="294" r="18" fill="#16A34A"/>
<text x="57" y="300" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">4</text>
<text x="96" y="300" font-family="sans-serif" font-size="15" fill="#191F28">食洗機使用可。上段ラックへの設置を推奨します。</text>
<rect x="0" y="355" width="${W}" height="5" fill="#F2F4F6"/>
</svg>`),

    enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="300">
<rect width="${W}" height="300" fill="#ffffff"/>
<rect width="${W}" height="64" fill="#16A34A"/>
<text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">セット内容</text>
<text x="40" y="104" font-family="sans-serif" font-size="15" fill="#4E5968">全8個セット · 様々なサイズで冷蔵・冷凍どちらにも活用可能</text>
<rect x="40" y="124" width="2" height="140" fill="#E5E8EB"/>
<circle cx="40" cy="148" r="5" fill="#16A34A"/>
<text x="60" y="153" font-family="sans-serif" font-size="14" fill="#191F28">正方形 大 (1.8L) × 2個 — おかず・ナムル類の保存に</text>
<circle cx="40" cy="185" r="5" fill="#16A34A"/>
<text x="60" y="190" font-family="sans-serif" font-size="14" fill="#191F28">正方形 中 (1.0L) × 2個 — フルーツ・ナッツ類の保存に</text>
<circle cx="40" cy="222" r="5" fill="#16A34A"/>
<text x="60" y="227" font-family="sans-serif" font-size="14" fill="#191F28">長方形 (0.7L) × 2個 — 肉・魚の冷凍保存に</text>
<circle cx="40" cy="259" r="5" fill="#16A34A"/>
<text x="60" y="264" font-family="sans-serif" font-size="14" fill="#191F28">小型 (0.35L) × 2個 — ソース・ドレッシングの保存に</text>
<rect x="0" y="295" width="${W}" height="5" fill="#F2F4F6"/>
</svg>`),

    enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="300">
<rect width="${W}" height="300" fill="#ffffff"/>
<rect width="${W}" height="64" fill="#6B7684"/>
<text x="40" y="42" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">ご注意事項</text>
<text x="40" y="102" font-family="sans-serif" font-size="14" fill="#4E5968">• フタを閉めたまま電子レンジの使用は禁止です。</text>
<text x="40" y="128" font-family="sans-serif" font-size="14" fill="#4E5968">• 直火・オーブン・ガスコンロの使用はできません。</text>
<text x="40" y="154" font-family="sans-serif" font-size="14" fill="#4E5968">• 衝撃により破損する恐れがありますのでご注意ください。</text>
<text x="40" y="180" font-family="sans-serif" font-size="14" fill="#4E5968">• 変色・変形防止のため、油分の多い食品の長期保存はお控えください。</text>
<text x="40" y="206" font-family="sans-serif" font-size="14" fill="#4E5968">• お子様の手の届かない場所に保管してください。</text>
<rect x="40" y="240" width="720" height="1" fill="#E5E8EB"/>
<text x="40" y="268" font-family="sans-serif" font-size="13" fill="#8B95A1">製造元: LOCK&LOCK Co., Ltd. · 輸入元: DayZero Inc.</text>
</svg>`),
];

// ── 공개 API ─────────────────────────────────────────────────────────────────

export const DETAIL_KO_SVGS = BEAUTY_KO_SVGS;
export const DETAIL_JA_SVGS = BEAUTY_JA_SVGS;

export const getDetailSvgs = (categoryPath: string): { ko: string[]; ja: string[] } => {
    const p = categoryPath.toLowerCase();
    if (
        p.includes('k-pop') || p.includes('kpop') || p.includes('음반') ||
        p.includes('アルバム') || p.includes('엔터테인먼트') || p.includes('エンタメ')
    ) {
        return { ko: KPOP_KO_SVGS, ja: KPOP_JA_SVGS };
    }
    if (
        p.includes('생활') || p.includes('주방') || p.includes('日用品') ||
        p.includes('キッチン') || p.includes('식품') || p.includes('food') ||
        p.includes('冷凍') || p.includes('ゴミ') || p.includes('洗濯') || p.includes('浴室')
    ) {
        return { ko: DAILY_KO_SVGS, ja: DAILY_JA_SVGS };
    }
    return { ko: BEAUTY_KO_SVGS, ja: BEAUTY_JA_SVGS };
};
