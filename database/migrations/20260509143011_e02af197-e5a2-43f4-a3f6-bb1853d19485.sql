
-- Categories
CREATE TABLE public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  color TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Products
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  mrp NUMERIC,
  unit TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  bg TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_featured ON public.products(featured) WHERE featured = true;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are publicly viewable"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Products are publicly viewable"
  ON public.products FOR SELECT
  USING (true);

-- Seed categories
INSERT INTO public.categories (id, name, emoji, color, sort_order) VALUES
  ('fruits',    'Fruits & Veggies',  '🥦', 'oklch(0.85 0.13 145)', 1),
  ('dairy',     'Dairy & Eggs',      '🥛', 'oklch(0.9 0.05 240)',  2),
  ('snacks',    'Snacks & Munchies', '🍿', 'oklch(0.88 0.12 75)',  3),
  ('beverages', 'Beverages',         '🥤', 'oklch(0.85 0.12 30)',  4),
  ('bakery',    'Bakery',            '🥖', 'oklch(0.88 0.1 60)',   5),
  ('household', 'Household',         '🧺', 'oklch(0.88 0.06 280)', 6),
  ('personal',  'Personal Care',     '🧴', 'oklch(0.88 0.08 320)', 7),
  ('frozen',    'Frozen Foods',      '🧊', 'oklch(0.9 0.06 220)',  8);

-- Seed products
INSERT INTO public.products (id, name, price, mrp, unit, category_id, emoji, description, bg, featured) VALUES
  ('p1','Fresh Bananas',49,60,'1 dozen','fruits','🍌','Sweet, ripe bananas picked at peak freshness.','oklch(0.95 0.12 95)',false),
  ('p2','Red Apples',129,150,'1 kg','fruits','🍎','Crisp and juicy farm-fresh apples.','oklch(0.9 0.13 25)',true),
  ('p3','Avocado',89,NULL,'2 pcs','fruits','🥑','Creamy hass avocados, perfectly ripe.','oklch(0.88 0.12 130)',false),
  ('p4','Tomatoes',39,50,'500 g','fruits','🍅','Vine-ripened red tomatoes.','oklch(0.9 0.13 25)',false),
  ('p5','Broccoli',79,NULL,'1 head','fruits','🥦','Fresh green broccoli florets.','oklch(0.88 0.13 145)',false),
  ('p6','Whole Milk',65,NULL,'1 L','dairy','🥛','Farm fresh whole milk.','oklch(0.94 0.02 240)',false),
  ('p7','Cheddar Cheese',240,280,'200 g','dairy','🧀','Aged cheddar, sharp and creamy.','oklch(0.9 0.14 80)',true),
  ('p8','Free-range Eggs',95,NULL,'6 pcs','dairy','🥚','Farm-fresh free range eggs.','oklch(0.95 0.04 80)',false),
  ('p9','Greek Yogurt',110,NULL,'400 g','dairy','🍦','Thick, creamy Greek yogurt.','oklch(0.95 0.02 240)',false),
  ('p10','Potato Chips',30,NULL,'100 g','snacks','🍟','Crunchy salted potato chips.','oklch(0.92 0.13 75)',false),
  ('p11','Chocolate Bar',80,100,'100 g','snacks','🍫','Rich dark chocolate.','oklch(0.85 0.08 50)',true),
  ('p12','Popcorn',60,NULL,'150 g','snacks','🍿','Buttery movie-style popcorn.','oklch(0.95 0.08 80)',false),
  ('p13','Mixed Nuts',320,NULL,'250 g','snacks','🥜','Premium mixed roasted nuts.','oklch(0.85 0.1 60)',false),
  ('p14','Orange Juice',120,NULL,'1 L','beverages','🧃','100% pure orange juice.','oklch(0.9 0.15 60)',true),
  ('p15','Cola',40,NULL,'500 ml','beverages','🥤','Refreshing cola classic.','oklch(0.85 0.1 25)',false),
  ('p16','Mineral Water',20,NULL,'1 L','beverages','💧','Pure mineral water.','oklch(0.93 0.05 220)',false),
  ('p17','Cold Brew Coffee',150,NULL,'330 ml','beverages','☕','Smooth cold brew coffee.','oklch(0.8 0.07 50)',false),
  ('p18','Sourdough Loaf',140,NULL,'500 g','bakery','🍞','Artisan sourdough, baked daily.','oklch(0.9 0.09 70)',false),
  ('p19','Croissants',180,NULL,'4 pcs','bakery','🥐','Buttery French croissants.','oklch(0.92 0.1 75)',true),
  ('p20','Bagels',120,NULL,'6 pcs','bakery','🥯','Chewy sesame bagels.','oklch(0.9 0.08 70)',false),
  ('p21','Dish Soap',95,NULL,'500 ml','household','🧼','Tough on grease, gentle on hands.','oklch(0.9 0.08 280)',false),
  ('p22','Paper Towels',160,NULL,'4 rolls','household','🧻','Absorbent kitchen paper towels.','oklch(0.94 0.02 240)',false),
  ('p23','Laundry Pods',450,NULL,'30 pods','household','🧺','Powerful laundry detergent pods.','oklch(0.88 0.1 280)',false),
  ('p24','Shampoo',280,NULL,'400 ml','personal','🧴','Nourishing daily shampoo.','oklch(0.88 0.1 320)',false),
  ('p25','Toothpaste',110,NULL,'150 g','personal','🪥','Whitening fluoride toothpaste.','oklch(0.94 0.04 220)',false),
  ('p26','Hand Sanitizer',75,NULL,'250 ml','personal','🧴','70% alcohol hand sanitizer.','oklch(0.92 0.06 220)',false),
  ('p27','Frozen Pizza',240,NULL,'400 g','frozen','🍕','Wood-fired margherita pizza.','oklch(0.9 0.13 30)',true),
  ('p28','Ice Cream',280,320,'500 ml','frozen','🍨','Belgian chocolate ice cream.','oklch(0.92 0.06 30)',false),
  ('p29','Frozen Berries',220,NULL,'300 g','frozen','🫐','Mixed berries, flash frozen.','oklch(0.85 0.1 290)',false);
