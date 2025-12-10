# -*- coding: utf-8 -*-
{
    'name': "Pos Price by Lot",

    'summary': "get product unit price by its lot price if tracked by lot",

    'description': """ """,

    'author': "Tarek Ashry",

    'category': 'Customization',
    'version': '18.0.1.0',


    'depends': ['base', 'point_of_sale', 'stock'],


    'data': [
        'views/views.xml',
    ],
    'assets':{
        'point_of_sale._assets_pos': [
            'pos18_test/static/src/js/pos_order_line.js',
        ]
    }
}

