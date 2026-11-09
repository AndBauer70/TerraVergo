import re,csv,sys
dd=open(sys.argv[1],encoding='utf-8').read()
tpl=open('template.html',encoding='utf-8').read()
fonts=re.search(r'<style>\s*@font-face.*?</style>',dd,re.S).group(0)
d3=re.search(r'<script>\s*// https://d3js.org/d3-array/.*?</script>',dd,re.S).group(0)
land=re.search(r'const LAND=[^\n]*',dd).group(0).strip()
if not land.endswith(';'):land+=';'
el=re.search(r'<!-- tv-earthlab -->.*?Zum Earth-Lab</a></div>',dd,re.S).group(0)
rows=list(csv.reader(open(sys.argv[2])))[1:]
y0,m0=map(int,rows[0][0].split('-'))
m=[float(r[2]) for r in rows]; d=[float(r[3]) for r in rows]
assert all(v>250 for v in m)
co2='const CO2={y0:%d,m0:%d,m:[%s],d:[%s]};'%(y0,m0,','.join('%.2f'%v for v in m),','.join('%.2f'%v for v in d))
out=tpl.replace('/*@@FONTS@@*/',fonts).replace('<!--@@D3@@-->',d3).replace('/*@@LAND@@*/',land).replace('/*@@CO2@@*/',co2).replace('/*@@EARTHLAB@@*/',el)
assert '@@' not in out
open(sys.argv[3],'w',encoding='utf-8').write(out)
print(len(out), rows[-1][0], len(m))
