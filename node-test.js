<script src="https://neveragain.allstatics.com/2019/assets/vendor/vue.min.js"></script>
<script src="https://pdf.wondershare.com/pfah/pardot-form.js"></script>
<script>
  var buttonText = {
  win: 'Switch to Mac',
  mac: 'Switch to Windows'
}
  var productInfo = {
  win: {
  license: [
{ name: 'Annual Plan', label: 'annual', value: '1' },
  // { name: 'Perpetual Plan', label: 'perpetual', value: '2' }
  ],

  priceInfo: {
  annualInfo: [
{
  user: 1,
  price: 269.99,
  url: 'https://store.wondershare.com/index.php?submod=checkout&method=index&currency=USD&language=English&sku_id=20014941&ver=v5&verify=18EBD0CBA7C6820F656B5334FA2B2781',
  paypal: 'https://store.wondershare.com/index.php?submod=checkout&method=index&currency=USD&language=English&sku_id=20014941&ver=v5&verify=18EBD0CBA7C6820F656B5334FA2B2781&flush=paypal'
},
{
  user: 2,
  price: 539.98,
  url: 'https://store.wondershare.com/index.php?submod=checkout&method=index&currency=USD&language=English&sku_id=20014961&ver=v5&verify=12BB6170DAB83585F914F8BAF0C63B65',
  paypal: 'https://store.wondershare.com/index.php?submod=checkout&method=index&currency=USD&language=English&sku_id=20014961&ver=v5&verify=12BB6170DAB83585F914F8BAF0C63B65&flush=paypal'
},
{
  user: 3,
  price: 688.47,
  url: 'https://store.wondershare.com/index.php?submod=checkout&method=index&currency=USD&language=English&sku_id=20014971&ver=v5&verify=169B71DE11A7D715957445D73E1050F5',
  paypal: 'https://store.wondershare.com/index.php?submod=checkout&method=index&currency=USD&language=English&sku_id=20014971&ver=v5&verify=169B71DE11A7D715957445D73E1050F5&flush=paypal'
},
{
  user: 4,
  price: 917.96,
  url: 'https://store.wondershare.com/index.php?submod=checkout&method=index&currency=USD&language=English&sku_id=20015021&ver=v5&verify=019BD1AC2B52580C2E17AE875CB074BB',
  paypal: 'https://store.wondershare.com/index.php?submod=checkout&method=index&currency=USD&language=English&sku_id=20015021&ver=v5&verify=019BD1AC2B52580C2E17AE875CB074BB&flush=paypal'
},
{
  user: 5,
  price: 1147.45,
  url: 'https://store.wondershare.com/index.php?submod=checkout&method=index&currency=USD&language=English&sku_id=20015011&ver=v5&verify=2C51AFA0B301DFCD36D71EAB29440203',
  paypal: 'https://store.wondershare.com/index.php?submod=checkout&method=index&currency=USD&language=English&sku_id=20015011&ver=v5&verify=2C51AFA0B301DFCD36D71EAB29440203&flush=paypal'
},
{
  user: 6,
  price: 1295.94,
  url: 'https://store.wondershare.com/index.php?submod=checkout&method=index&currency=USD&language=English&sku_id=20015031&ver=v5&verify=7403D372447CD5811FC9764FE452C585',
  paypal: 'https://store.wondershare.com/index.php?submod=checkout&method=index&currency=USD&language=English&sku_id=20015031&ver=v5&verify=7403D372447CD5811FC9764FE452C585&flush=paypal'
},
{
  user: 7,
  price: 1511.93,
  url: 'https://store.wondershare.com/index.php?submod=checkout&method=index&currency=USD&language=English&sku_id=20015041&ver=v5&verify=44B0B7CD4307B3D00C7A358E34A86AF4',
  paypal: 'https://store.wondershare.com/index.php?submod=checkout&method=index&currency=USD&language=English&sku_id=20015041&ver=v5&verify=44B0B7CD4307B3D00C7A358E34A86AF4&flush=paypal'
},
{
  user: 8,
  price: 1727.92,
  url: 'https://store.wondershare.com/index.php?submod=checkout&method=index&currency=USD&language=English&sku_id=20014981&ver=v5&verify=F61C16C2B2D14A7AA7F5A42EEF195483',
  paypal: 'https://store.wondershare.com/index.php?submod=checkout&method=index&currency=USD&language=English&sku_id=20014981&ver=v5&verify=F61C16C2B2D14A7AA7F5A42EEF195483&flush=paypal'
},
{
  user: 9,
  price: 1943.91,
  url: 'https://store.wondershare.com/index.php?submod=checkout&method=index&currency=USD&language=English&sku_id=20014991&ver=v5&verify=F39E4316B5157617D1E8D971CE4A7499',
  paypal: 'https://store.wondershare.com/index.php?submod=checkout&method=index&currency=USD&language=English&sku_id=20014991&ver=v5&verify=F39E4316B5157617D1E8D971CE4A7499&flush=paypal'
},
{
  user: 10,
  price: 2159.9,
  url: 'https://store.wondershare.com/index.php?submod=checkout&method=index&currency=USD&language=English&sku_id=20015001&ver=v5&verify=B3D4A2A383F64FD36968B39468BD8E59',
  paypal: 'https://store.wondershare.com/index.php?submod=checkout&method=index&currency=USD&language=English&sku_id=20015001&ver=v5&verify=B3D4A2A383F64FD36968B39468BD8E59&flush=paypal'
}
  ],
  // perpetualInfo: [
  //   {
  //     user: 1,
  //     price: 99.99,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7743&license_id=2651&sub_lid=0&currency=USD&language=English&verify=13a32fc63da5e254fceb6d840b2cf56a'
  //   },
  //   {
  //     user: 2,
  //     price: 195.98,
  //     dPrice: 199.98,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7743&license_id=2426&sub_lid=0&currency=USD&language=English&verify=ed86ce93cb637e83186e5fe40f9ba441'
  //   },
  //   {
  //     user: 3,
  //     price: 290.97,
  //     dPrice: 299.97,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7743&license_id=2424&sub_lid=0&currency=USD&language=English&verify=12d85e09fa020c929f346c3ee377b130'
  //   },
  //   {
  //     user: 4,
  //     price: 383.96,
  //     dPrice: 399.96,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7743&license_id=2425&sub_lid=0&currency=USD&language=English&verify=0879b15113eae3a6fcd7fc68573c0f94'
  //   },
  //   {
  //     user: 5,
  //     price: 474.95,
  //     dPrice: 499.95,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7743&license_id=2423&sub_lid=0&currency=USD&language=English&verify=4dea282dd43666b4493264df66a9a15b'
  //   },
  //   {
  //     user: 6,
  //     price: 563.94,
  //     dPrice: 599.94,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7743&license_id=2965&sub_lid=0&currency=USD&language=English&verify=13f7315d9b64d8a664a49924feadc400'
  //   },
  //   {
  //     user: 7,
  //     price: 650.93,
  //     dPrice: 699.93,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7743&license_id=2965&sub_lid=0&currency=USD&language=English&verify=13f7315d9b64d8a664a49924feadc400'
  //   },
  //   {
  //     user: 8,
  //     price: 735.92,
  //     dPrice: 799.92,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7743&license_id=2963&sub_lid=0&currency=USD&language=English&verify=a00f57979dc3dbc18ff965e72273a5d9'
  //   },
  //   {
  //     user: 9,
  //     price: 818.91,
  //     dPrice: 899.91,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7743&license_id=2963&sub_lid=0&currency=USD&language=English&verify=a00f57979dc3dbc18ff965e72273a5d9'
  //   },
  //   {
  //     user: 10,
  //     price: 899.91,
  //     dPrice: 999.9,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7743&license_id=2962&sub_lid=0&currency=USD&language=English&verify=0410ac546b9aa149951717468d008d9e'
  //   },
  //   {
  //     user: 11,
  //     price: 967.9,
  //     dPrice: 1099.89,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7743&license_id=2961&sub_lid=0&currency=USD&language=English&verify=c9b78e9a3f3e2e60c4d878e4ffb77fca'
  //   },
  //   {
  //     user: 12,
  //     price: 1031.89,
  //     dPrice: 1199.88,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7743&license_id=2960&sub_lid=0&currency=USD&language=English&verify=aedb8d76656e343b78c7af180453fa8b'
  //   },
  //   {
  //     user: 13,
  //     price: 1091.89,
  //     dPrice: 1299.87,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7743&license_id=2959&sub_lid=0&currency=USD&language=English&verify=2b691a55c83cc738b0254daead975462'
  //   },
  //   {
  //     user: 14,
  //     price: 1147.88,
  //     dPrice: 1399.86,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7743&license_id=2958&sub_lid=0&currency=USD&language=English&verify=e2ffe8091062d37a23336c6c93030a4f'
  //   },
  //   {
  //     user: 15,
  //     price: 1199.88,
  //     dPrice: 1499.85,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7743&license_id=2957&sub_lid=0&currency=USD&language=English&verify=a3a1d84414053ea2ba06162871cc1e43'
  //   },
  //   {
  //     user: 16,
  //     price: 1247.87,
  //     dPrice: 1599.84,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7743&license_id=2956&sub_lid=0&currency=USD&language=English&verify=bc3c33c5206ae0b2f53e820c8f475e10'
  //   },
  //   {
  //     user: 17,
  //     price: 1291.87,
  //     dPrice: 1699.83,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7743&license_id=2956&sub_lid=0&currency=USD&language=English&verify=bc3c33c5206ae0b2f53e820c8f475e10'
  //   },
  //   {
  //     user: 18,
  //     price: 1331.86,
  //     dPrice: 1799.82,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7743&license_id=2954&sub_lid=0&currency=USD&language=English&verify=a4fa1a5f5d1eb8ca54e3db0637111bcb'
  //   },
  //   {
  //     user: 19,
  //     price: 1367.86,
  //     dPrice: 1899.81,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7743&license_id=2953&sub_lid=0&currency=USD&language=English&verify=5c5a3a723202af9ddca467cad4ca34de'
  //   },
  //   {
  //     user: 20,
  //     price: 1399.86,
  //     dPrice: 1999.8,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7743&license_id=2952&sub_lid=0&currency=USD&language=English&verify=67546ca9985c3547805f7e85367517a0'
  //   }
  // ]
}
},
  mac: {
  license: [
{ name: 'Annual Plan', label: 'annual', value: '1' },
  // { name: 'Perpetual Plan', label: 'perpetual', value: '2' }
  ],
  priceInfo: {
  annualInfo: [
{
  user: 1,
  price: 69.99,
  url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2339&sub_lid=0&currency=USD&language=English&verify=3ea468e9866987cf8d96c399ee1f4375'
},
{
  user: 2,
  price: 137.18,
  dPrice: 139.98,
  url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2345&sub_lid=0&currency=USD&language=English&verify=388297b95fb197f9fa55aa4332986ca5'
},
{
  user: 3,
  price: 203.67,
  dPrice: 209.97,
  url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2346&sub_lid=0&currency=USD&language=English&verify=1c1d535acd04c87866e77a1354ed851e'
},
{
  user: 4,
  price: 268.76,
  dPrice: 279.96,
  url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2347&sub_lid=0&currency=USD&language=English&verify=c409efe997065b53d0f0dd83986db60b'
},
{
  user: 5,
  price: 332.45,
  dPrice: 349.95,
  url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=406&sub_lid=0&currency=USD&language=English&verify=96725994d9a59464361aaacad5a7247c'
},
{
  user: 6,
  price: 394.74,
  dPrice: 419.94,
  url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2951&sub_lid=0&currency=USD&language=English&verify=82fc08396a24ce01eaaea4afb73cc7ca',
  paypal: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2951&sub_lid=0&currency=USD&language=English&verify=82fc08396a24ce01eaaea4afb73cc7ca&flush=paypal'
},
{
  user: 7,
  price: 455.63,
  dPrice: 489.93,
  url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2950&sub_lid=0&currency=USD&language=English&verify=23d1bfe28538dac3255cd513cd5b1004',
  paypal: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2950&sub_lid=0&currency=USD&language=English&verify=23d1bfe28538dac3255cd513cd5b1004&flush=paypal'
},
{
  user: 8,
  price: 515.12,
  dPrice: 559.92,
  url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2949&sub_lid=0&currency=USD&language=English&verify=47f563dd3af2cf24d13636ed4f5899fc',
  paypal: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2949&sub_lid=0&currency=USD&language=English&verify=47f563dd3af2cf24d13636ed4f5899fc&flush=paypal'
},
{
  user: 9,
  price: 573.21,
  dPrice: 629.91,
  url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2948&sub_lid=0&currency=USD&language=English&verify=3d85ef183ea88840ecdf7b0002341924',
  paypal: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2948&sub_lid=0&currency=USD&language=English&verify=3d85ef183ea88840ecdf7b0002341924&flush=paypal'
},
{
  user: 10,
  price: 629.91,
  dPrice: 699.9,
  url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2947&sub_lid=0&currency=USD&language=English&verify=cedbed28ec639ab94bf413da95d5909c',
  paypal: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2947&sub_lid=0&currency=USD&language=English&verify=cedbed28ec639ab94bf413da95d5909c&flush=paypal'
},
{
  user: 11,
  price: 677.5,
  dPrice: 769.89,
  url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2946&sub_lid=0&currency=USD&language=English&verify=9287e7061c4f8b0e54082da44fe4f628',
  paypal: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2946&sub_lid=0&currency=USD&language=English&verify=9287e7061c4f8b0e54082da44fe4f628&flush=paypal'
},
{
  user: 12,
  price: 722.29,
  dPrice: 839.88,
  url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2945&sub_lid=0&currency=USD&language=English&verify=79c1712ffb1e440081d4f17a6372cf5d',
  paypal: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2945&sub_lid=0&currency=USD&language=English&verify=79c1712ffb1e440081d4f17a6372cf5d&flush=paypal'
},
{
  user: 13,
  price: 764.29,
  dPrice: 909.87,
  url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2944&sub_lid=0&currency=USD&language=English&verify=efdfe112527579f51ae1da3a9f7be803',
  paypal: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2944&sub_lid=0&currency=USD&language=English&verify=efdfe112527579f51ae1da3a9f7be803&flush=paypal'
},
{
  user: 14,
  price: 803.48,
  dPrice: 979.86,
  url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2943&sub_lid=0&currency=USD&language=English&verify=62812335564c368c2b23550486e96415',
  paypal: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2943&sub_lid=0&currency=USD&language=English&verify=62812335564c368c2b23550486e96415&flush=paypal'
},
{
  user: 15,
  price: 839.88,
  dPrice: 1049.85,
  url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2942&sub_lid=0&currency=USD&language=English&verify=b50d6966215c66e24b97c1438a788d02',
  paypal: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2942&sub_lid=0&currency=USD&language=English&verify=b50d6966215c66e24b97c1438a788d02&flush=paypal'
},
{
  user: 16,
  price: 873.47,
  dPrice: 1119.84,
  url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2941&sub_lid=0&currency=USD&language=English&verify=0f79ae3cf82ccd75ae0c92afb93494d6',
  paypal: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2941&sub_lid=0&currency=USD&language=English&verify=0f79ae3cf82ccd75ae0c92afb93494d6&flush=paypal'
},
{
  user: 17,
  price: 904.27,
  dPrice: 1189.83,
  url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2940&sub_lid=0&currency=USD&language=English&verify=73a950dea4355ab2eebb170bed686333',
  paypal: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2940&sub_lid=0&currency=USD&language=English&verify=73a950dea4355ab2eebb170bed686333&flush=paypal'
},
{
  user: 18,
  price: 932.26,
  dPrice: 1259.82,
  url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2939&sub_lid=0&currency=USD&language=English&verify=50350fc867f6074ad010eee9fe12ccdd',
  paypal: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2939&sub_lid=0&currency=USD&language=English&verify=50350fc867f6074ad010eee9fe12ccdd&flush=paypal'
},
{
  user: 19,
  price: 957.46,
  dPrice: 1329.81,
  url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2938&sub_lid=0&currency=USD&language=English&verify=c5e9c79ce027595b0ba4ae18c80a7c94',
  paypal: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2938&sub_lid=0&currency=USD&language=English&verify=c5e9c79ce027595b0ba4ae18c80a7c94&flush=paypal'
},
{
  user: 20,
  price: 979.86,
  dPrice: 1399.8,
  url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2937&sub_lid=0&currency=USD&language=English&verify=893c29da9bd26cd9c2fbaea24a96131c',
  paypal: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2937&sub_lid=0&currency=USD&language=English&verify=893c29da9bd26cd9c2fbaea24a96131c&flush=paypal'
}
  ],
  // perpetualInfo: [
  //   {
  //     user: 1,
  //     price: 99.99,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2651&sub_lid=0&currency=USD&language=English&verify=6eada4a1bd9fb4a199ba7cda4f9b9c2c'
  //   },
  //   {
  //     user: 2,
  //     price: 195.98,
  //     dPrice: 199.98,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2426&sub_lid=0&currency=USD&language=English&verify=213076866ee376cf8d708d67e66e3bd0'
  //   },
  //   {
  //     user: 3,
  //     price: 290.97,
  //     dPrice: 299.97,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2424&sub_lid=0&currency=USD&language=English&verify=8fab4d9b5dd5caa43774042d07ecf6b8'
  //   },
  //   {
  //     user: 4,
  //     price: 383.96,
  //     dPrice: 399.96,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2425&sub_lid=0&currency=USD&language=English&verify=9a0d85f0e6d68ba426a8204a82bd034d'
  //   },
  //   {
  //     user: 5,
  //     price: 474.95,
  //     dPrice: 499.95,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2423&sub_lid=0&currency=USD&language=English&verify=4f0550c92082cba8abb04e41a68d10b5'
  //   },
  //   {
  //     user: 6,
  //     price: 563.94,
  //     dPrice: 599.94,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2965&sub_lid=0&currency=USD&language=English&verify=e101a4e4685a04b64a7ea2d0391860ac'
  //   },
  //   {
  //     user: 7,
  //     price: 650.93,
  //     dPrice: 699.93,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2964&sub_lid=0&currency=USD&language=English&verify=b69d3daa3b419d93301afa608760c623'
  //   },
  //   {
  //     user: 8,
  //     price: 735.92,
  //     dPrice: 799.92,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2963&sub_lid=0&currency=USD&language=English&verify=986fa766164fa8b49014ed0c7c7b7c3e'
  //   },
  //   {
  //     user: 9,
  //     price: 818.91,
  //     dPrice: 899.91,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2962&sub_lid=0&currency=USD&language=English&verify=47c23b1b3943e6b38653445ca543dd67'
  //   },
  //   {
  //     user: 10,
  //     price: 899.91,
  //     dPrice: 999.9,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2966&sub_lid=0&currency=USD&language=English&verify=951ce13f6d5149e1bc8f10fa4b16a4a8'
  //   },
  //   {
  //     user: 11,
  //     price: 967.9,
  //     dPrice: 1099.89,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2961&sub_lid=0&currency=USD&language=English&verify=7c674eaa29486712add4ec34d84a335a'
  //   },
  //   {
  //     user: 12,
  //     price: 1031.89,
  //     dPrice: 1199.88,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2960&sub_lid=0&currency=USD&language=English&verify=efc65788c3d1216a44e55674bde37c85'
  //   },
  //   {
  //     user: 13,
  //     price: 1091.89,
  //     dPrice: 1299.87,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2959&sub_lid=0&currency=USD&language=English&verify=126d0d28621b565c2aa66ba7aa51a592'
  //   },
  //   {
  //     user: 14,
  //     price: 1147.88,
  //     dPrice: 1399.86,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2958&sub_lid=0&currency=USD&language=English&verify=6018899ecce76ae78dfdbeebcceb79f9'
  //   },
  //   {
  //     user: 15,
  //     price: 1199.88,
  //     dPrice: 1499.85,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2957&sub_lid=0&currency=USD&language=English&verify=4513426626a2218b75f5241fafc7eb95'
  //   },
  //   {
  //     user: 16,
  //     price: 1247.87,
  //     dPrice: 1599.84,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2956&sub_lid=0&currency=USD&language=English&verify=dacb8283dd2ca4c635f311a92636e229'
  //   },
  //   {
  //     user: 17,
  //     price: 1291.87,
  //     dPrice: 1699.83,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2955&sub_lid=0&currency=USD&language=English&verify=08eb4d3c68f3222f673a6330ded78b8e'
  //   },
  //   {
  //     user: 18,
  //     price: 1331.86,
  //     dPrice: 1799.82,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2954&sub_lid=0&currency=USD&language=English&verify=bd6d2ab15eb1775043c8560eb8eb710f'
  //   },
  //   {
  //     user: 19,
  //     price: 1367.86,
  //     dPrice: 1899.81,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2953&sub_lid=0&currency=USD&language=English&verify=1b7ec813b413a00a04c9b755e7b58c76'
  //   },
  //   {
  //     user: 20,
  //     price: 1399.86,
  //     dPrice: 1999.8,
  //     url: 'https://store.wondershare.com/index.php?method=index&submod=checkout&pid=7744&license_id=2952&sub_lid=0&currency=USD&language=English&verify=0f1de728b080bf2eb0ce86e212293d19'
  //   }
  // ]
}
}
}

  new Vue({
  el: '#vue-container',
  data: {
  pageSys: 'win',
  buttonText: '',
  target: '',
  currency: '$', // 货币，多语言可更改为自己的
  annual: 1, // 默认展示年，默认选择终身此处设为2
  user: 1, // 默认1个用户，1-10
  maxNum: 10, // 最多可选人数5,
  perpetualComfirm: false, // 终身价是否默认勾选升级价格，false不勾选，true勾选
  perpetualAdd: 10, // 附加价格
  productLicense: [],
  annualInfo: [],
  perpetualInfo: [],
  buyLink: '',
  educationLink: '',
  businessLink: '',
  bundleLink: ''
},
  created() {
  var _this = this
  goSystemJudge(function (pageSys, currSys) {
  _this.pageSys = pageSys
  _this.buttonText = buttonText[pageSys]
  _this.setPrice()
  _this.setLink()
})
},
  mounted() {
  var _this = this
  _this.setParams('auth_code')
  _this.annualInfo.forEach(function (e) {
  e.url = e.url + (e.url.indexOf('?') > -1 ? '&' : '?') + _this.target
})
  // _this.perpetualInfo.forEach(function (e) {
  //   e.url = e.url + (e.url.indexOf('?') > -1 ? '&' : '?') + _this.target
  // })
  this.setHeight()
},
  updated() {
  this.setHeight()
},
  methods: {
  setHeight() {
  // 计算pardot表单的textarea高度
  var buyListHeight = document.querySelector('#buy-list').offsetHeight
  var pardotContainerHeight = document.querySelector('#pardot-container').offsetHeight
  var pardotTextHeight = document.querySelector('.pardot-text').offsetHeight
  var pardotFormHeight = document.querySelector('.pfah-form').offsetHeight
  var pardotTextAreaHeight = document.querySelector('.pardot-textarea').offsetHeight

  console.log(buyListHeight, pardotContainerHeight)
  if (buyListHeight > pardotContainerHeight) {
  var height = buyListHeight - pardotTextHeight - pardotFormHeight
  document.querySelector('.pardot-textarea').style.height = pardotTextAreaHeight + height - 24 + 'px'
} else {
  var height = pardotContainerHeight - buyListHeight
  document.querySelector('.pardot-textarea').style.height = pardotTextAreaHeight - height - 24 + 'px'
}
},
  setLink() {
  var pageSys = this.pageSys
  console.log(setLink);
  let link = setLink(pageSys)
  this.businessLink = link.businessLink
  this.buyLink = link.buyLink
  this.educationLink = link.educationLink
  this.bundleLink = link.bundleLink
},
  switchSys() {
  var pageSys = this.pageSys
  if (pageSys == 'win') {
  this.pageSys = 'mac'
} else {
  this.pageSys = 'win'
}
  this.annual = 1
  this.user = 1
  this.buttonText = buttonText[this.pageSys]
  this.setPrice()
  this.setLink()
},
  setPrice() {
  var sys = this.pageSys
  var info
  if (sys !== 'default') {
  info = productInfo[sys]
} else {
  info = productInfo
}
  ;(this.productLicense = info.license), (this.annualInfo = info.priceInfo.annualInfo), (this.perpetualInfo = info.priceInfo.perpetualInfo)
},
  setComfirm() {
  if (!this.perpetualComfirm) {
  this.comfirmHref = this.target ? this.perpetualAddList[this.user - 1] + (this.perpetualAddList[this.user - 1].indexOf('?') > -1 ? '&' : '?') + this.target : this.perpetualAddList[this.user - 1]
}
},
  getParams(aim) {
  var url = location.search
  var param = {}
  if (url.indexOf('?') != -1) {
  var str = url.substr(1)
  strs = str.split('&')
  for (var i = 0; i < strs.length; i++) {
  if (strs[i].split('=')[0] == aim) {
  param[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
}
}
}
  return param
},
  setParams(param) {
  if (JSON.stringify(this.getParams(param)) != '{}') {
  this.target = param + '=' + this.getParams(param)[param]
}
}
}
})
</script>
<script>
  $('body').on('pfah.callback', function (e, id, result) {
  if (id === 'pfah-8vscjy') {
  setTimeout(function () {
  $('[data-id="' + id + '"]')
  .find('[type="submit"]')
  .attr('disabled', 'disabled')
}, 200)
}
})

  $('input, textarea').on('input', function () {
  var placeholder = $(this).parent().find('.placeholder')
  $(this).val() ? placeholder.hide() : placeholder.show()
})
  $('select').on('change', function () {
  var placeholder = $(this).parent().find('.placeholder')
  $(this).addClass('show')
  placeholder.hide()
})
  // 点击popover icon
  let timer1 = null
  $('[t="popover"]').on('mouseover', function (e) {
  e.stopPropagation()
  var $this = $(this)
  $this.popover('show')
  $('.bs-popover-top').on('mouseover', function (e) {
  clearTimeout(timer1)
  // $this.popover('show')
})
  $('.bs-popover-top').on('mouseleave', function (e) {
  $this.popover('hide')
})
})
  $('[t="popover"]').on('mouseleave', function (e) {
  var $this = $(this)
  timer1 = setTimeout(()=>{
  $this.popover('hide')
},300)
})
  // 点击checkbox按钮
  $('[id^="customCheck"]').on('change', function () {
  var parent = $(this).parents('.buy-container')
  if ($(this).is(':checked')) {
  $(parent).find('.btn-groups-1').removeClass('hidden')
  $(parent).find('.btn-groups-2').addClass('hidden')
} else {
  $(parent).find('.btn-groups-1').addClass('hidden')
  $(parent).find('.btn-groups-2').removeClass('hidden')
}
})
</script>