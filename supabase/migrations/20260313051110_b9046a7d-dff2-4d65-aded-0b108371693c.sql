
-- Fix overly permissive INSERT policies
DROP POLICY "Authenticated users can create notifications" ON public.notifications;
CREATE POLICY "Authenticated users can create notifications" ON public.notifications FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY "Anyone can insert product views" ON public.product_views;
CREATE POLICY "Anyone can insert product views" ON public.product_views FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

DROP POLICY "Anyone can insert search queries" ON public.search_queries;
CREATE POLICY "Anyone can insert search queries" ON public.search_queries FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');
