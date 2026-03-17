# Polymarket Transparency

## 目的
Polymarketのやらせ取引・ウォッシュトレードを可視化し、バイラルでAttentionを獲得する。

## コンセプト
「このベットの67%は同一エンティティによるウォッシュです」を誰でも見れるサイト。

## なぜやるか
- 金は直接取れない。でもAttentionが取れる
- 「こいつらオンチェーン分析できる」の信頼構築
- Defense Terminal (Project A) への布石

---

## 機能

### MVP (Week 1-2)
1. **ウォッシュトレード検出**
   - 同一アドレス間の往復取引
   - 同一エンティティの複数アドレス推定（資金源分析）
   - 取引タイミングの異常パターン

2. **Market別やらせ率表示**
   - 各ベットの「健全度スコア」
   - 「このマーケットの取引の X% はやらせの疑い」

3. **インフルエンサー追跡**
   - Xでポジション公開してる人のオンチェーン実態
   - 「言ってること」vs「やってること」の乖離

### Phase 2 (Week 3-4)
4. **勝者/敗者の分布**
   - 「このベットで儲けた人」のウォレット分析
   - 情報優位者の特定（常に勝つアドレス）

5. **アラート機能**
   - 「異常な大口ベットが入りました」
   - Twitter/Telegram bot

---

## 技術スタック

```
Frontend:    Next.js + Tailwind
Backend:     Node.js / Python
Data:        Polygon (Polymarket はPolygon上)
Indexing:    自前 or Dune/Flipside
DB:          PostgreSQL or Supabase
Hosting:     Vercel
```

## データソース
- Polymarket contracts on Polygon
- The Graph / Dune Analytics
- Polygonscan API

---

## 成功指標
- [ ] CT (Crypto Twitter) でバズる
- [ ] メディア掲載（CoinDesk, The Block等）
- [ ] 月間 100K PV
- [ ] 「あのサイト作った人たち」と認知される

---

## リスク
- Polymarketから法的クレーム（可能性低、公開データの分析なので）
- 分析が間違っていた場合の信頼失墜
- バズらなかった場合の時間ロス

---

## 次のアクション
1. [ ] Polymarket のコントラクトアドレス特定
2. [ ] 取引データのインデクシング方法決定
3. [ ] ウォッシュトレード検出ロジック設計
4. [ ] LP/モックアップ作成
