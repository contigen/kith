type TimelineEvent = {
  event: string
  date: Date
  issuer: string
}

type AgentTimelineProps = {
  timeline: TimelineEvent[]
}

export function AgentTimeline({ timeline }: AgentTimelineProps) {
  return (
    <div className='relative'>
      <div
        className='absolute left-3 top-0 h-full w-px bg-border'
        aria-hidden='true'
      />
      <ul className='space-y-4'>
        {timeline.map((item, index) => (
          <li key={index} className='relative pl-8'>
            <div
              className='absolute left-0 top-1 h-6 w-6 rounded-full border border-background bg-muted flex items-center justify-center'
              aria-hidden='true'
            >
              <div className='h-2 w-2 rounded-full bg-foreground' />
            </div>
            <div className='space-y-1'>
              <div className='flex items-center justify-between'>
                <h4 className='text-sm font-medium'>{item.event}</h4>
                <time className='text-xs text-muted-foreground'>
                  {item.date.toLocaleDateString()}
                </time>
              </div>
              <p className='text-sm text-muted-foreground'>
                Issued by {item.issuer}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
