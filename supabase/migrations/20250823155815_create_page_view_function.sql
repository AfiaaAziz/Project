-- Function to increment page views for a campaign
create or replace function increment_page_view(campaign_id_to_update uuid)
returns void
language sql
as $$
  update public.campaigns
  set page_views = page_views + 1
  where id = campaign_id_to_update;
$$;