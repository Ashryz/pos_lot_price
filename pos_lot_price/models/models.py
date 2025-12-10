from odoo import fields,models, api


class StockLot(models.Model):
    _name = 'stock.lot'
    _inherit = ['stock.lot', 'pos.load.mixin']

    custom_price = fields.Float(default=10.0)
    @api.model
    def _load_pos_data_fields(self, config_id):
        return ['name','custom_price','product_id']

class PosSession(models.Model):
    _inherit = 'pos.session'

    @api.model
    def _load_pos_data_models(self, config_id):
        res = super(PosSession, self)._load_pos_data_models(config_id)
        res.append('stock.lot')
        return res