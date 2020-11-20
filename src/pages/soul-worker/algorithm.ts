

export type CraftingCost = {
  low?: number
  mid?: number
  high?: number
  cost?: number
}

export type FragmentsEntry = {
  level?: number
  quantity?: number
  price?: number
  matching_element?: boolean
  used?: number
};

export const CONVERTION_COST = [ 100, 1000, 10000 ];
export const FRAGMENT_CRAFTING_COST = [ 10000, 20000 ];
export const COST_DATA: CraftingCost[] = `
  10    0   0   80000
  24    0   0   200000
  40    1   0   400000
  40    3   1   700000
  40    4   2   1000000
  80    7   3   1400000
  80    8   4   2000000
  160   16  8   2700000
  240   24  16  3500000
`.trim().split(/\W+/g).reduce((l, r, i) => {
  let last = i == 0 ? null : l[l.length - 2];
  switch(i % 4){
  case 0:
    if(i == 0){
      return [ ...l, { low: ~~r } ];
    } else{
      last = l[l.length - 1];
    }
    return [ ...l, { low: ~~r + ( last ? last.low : 0 )} ];
  case 1:
    l[l.length - 1].mid = ~~r + ( last ? last.mid : 0 );
    return l;
  case 2:
    l[l.length - 1].high = ~~r + ( last ? last.high : 0 );
    return l;
  case 3:
    l[l.length - 1].cost = ~~r + ( last ? last.cost : 0 );
    return l;
  }
  return l
}, []);
console.log("COST_DATA:", COST_DATA);

export function calculateTotalCost(
    fragment_entries: FragmentsEntry[]
): [
    fragment_cost: number,
    conversion_cost: number,
    crafting_cost: number,
    remaining_fragments: number[],
    fragment_used: number[]
] {
  let { cost: crafting_cost, low, mid, high } = COST_DATA[8];
  let fragments_required = [ low, mid, high ];
  
  let fragment_cost = 0;
  let conversion_cost = 0;

  let remaining_fragments = fragments_required.slice(0);
  let used = new Array(fragment_entries.length).fill(0);
  [0, 1, 2].forEach(target_level => {
    for(let i = 0; i < fragment_entries.length; ++i){
      let {
        level, price, quantity, matching_element
      } = fragment_entries[i];

      if(level !== target_level){
        continue;
      }

      let used_this_time = Math.max(0, Math.min(
          quantity - used[i],
          remaining_fragments[level],
      ));
      remaining_fragments[level] = (
        remaining_fragments[level] - used_this_time
      );

      if(!matching_element){
        conversion_cost += used_this_time * CONVERTION_COST[level];
      }

      fragment_cost += price * used_this_time;

      used[i] += used_this_time;
    }
  });


  return [
    fragment_cost,
    conversion_cost,
    crafting_cost,
    remaining_fragments,
    used
  ];
}