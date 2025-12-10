/** @odoo-module **/
import { registry } from "@web/core/registry";
import { Base } from "@point_of_sale/app/models/related_models";
import { PosOrderline } from "@point_of_sale/app/models/pos_order_line";
import { patch } from "@web/core/utils/patch";



export class StockLot extends Base {
    static pythonModel = "stock.lot";

}

registry.category("pos_available_models").add(StockLot.pythonModel, StockLot);

patch(PosOrderline.prototype, {
    setOptions(options) {
        super.setOptions(options);

        // Apply custom lot price
        if (this.pack_lot_ids?.length && this.product_id) {
            const selectedLotNames = this.pack_lot_ids.map(l => l.lot_name);

            const lotModel = this.models["stock.production.lot"] || this.models["stock.lot"];
            if (!lotModel) return;

            const allLots = lotModel.getAll();
            const productId = this.product_id;

            const matchedLot = allLots.find(lot => {
                const lotProductId = Array.isArray(lot.product_id) ? lot.product_id[0] : lot.product_id;
                return lotProductId === productId && selectedLotNames.includes(lot.name);
            });

            if (matchedLot?.custom_price > 0) {
                this.price_unit = matchedLot.custom_price;
                this.price_type = "manual";
                this.setDirty();
                this.order_id.recomputeOrderData();
            }
        }
    },
    setPackLotLines({ modifiedPackLotLines = {}, newPackLotLines = [], setQuantity = true }) {

        super.setPackLotLines({ modifiedPackLotLines, newPackLotLines, setQuantity });

        this.applySelectedLotPrice();
    },

    applySelectedLotPrice() {
        // Collect lot names AFTER popup sets them
        const selectedLotNames = this.pack_lot_ids?.map(l => l.lot_name) || [];

        if (!selectedLotNames.length) {
            return;
        }

        // Get lot model
        const lotModel =
            this.models["stock.production.lot"] ||
            this.models["stock.lot"];
        if (!lotModel) {
            console.warn("Lot model not loaded in POS.");
            return;
        }

        const allLots = lotModel.getAll();

        // Current product reference
        const productId = this.product_id;

        const matchedLot = allLots.find(lot => {
            const lotProductId = Array.isArray(lot.product_id)
                ? lot.product_id[0]
                : lot.product_id;
            return (
                lotProductId === productId &&
                selectedLotNames.includes(lot.name)
            );
        });

        if (!matchedLot) return;

        // Apply custom price ONLY from the selected lot
        if (matchedLot.custom_price > 0) {
            this.price_unit = matchedLot.custom_price;
            this.price_type = "manual";
            this.setDirty();
            this.order_id.recomputeOrderData();
        }
    },
});
