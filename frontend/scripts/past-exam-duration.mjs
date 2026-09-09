const names={mathematics:'数学',physics:'物理',chemistry:'化学',biology:'生物',english:'英語',japanese:'国語'};
export function durationLabelFor(duration,subject,override) {
  if(override)return override.label;
  if(!duration?.minutes)return '試験時間は原本確認中';
  const ids=duration.subject_ids??[subject];
  if(duration.kind==='combined_subjects') {
    const science=ids.every(id=>['physics','chemistry','biology'].includes(id));
    if(/[2２]科目/.test(duration.note??'')&&(science||/選択|選ぶ/.test(duration.note??'')))return `${science?'理科':'選択'}2科目 合計${duration.minutes}分`;
    return `${ids.map(id=>names[id]??id).join('・')} 合計${duration.minutes}分`;
  }
  return `${names[subject]??subject} ${duration.minutes}分`;
}
