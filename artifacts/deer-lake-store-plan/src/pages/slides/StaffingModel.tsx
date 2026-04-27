export default function StaffingModel() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bg text-text">
      <div className="absolute inset-0 px-[6vw] py-[6vh] flex flex-col">
        <div className="flex items-baseline justify-between mb-[3vh]">
          <div>
            <div className="font-mono uppercase tracking-[0.28em] text-[1vw] text-muted mb-[1vh]">
              Who works the store
            </div>
            <h2 className="font-display text-[3.8vw] leading-[1] tracking-tight text-primary font-medium">
              The store is built to keep working
              <span className="italic font-normal text-accent"> when people don't show up.</span>
            </h2>
          </div>
          <div className="text-right pl-[3vw] shrink-0 max-w-[34vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[1.05vw] text-muted mb-[0.6vh]">
              The honest design rule
            </div>
            <div className="font-body text-[1.25vw] text-primary leading-[1.35]">
              Hunting season. Funerals. Hockey tournaments. Bad weather days. Most northern stores fall apart because they need everyone to show up every day. This one is built the other way.
            </div>
          </div>
        </div>

        <div
          className="rounded-[0.4vw] p-[1.6vw] mb-[2vh] flex items-center justify-between gap-[2vw]"
          style={{ background: "var(--slide-paper)", borderLeft: "0.4vw solid var(--slide-accent)" }}
        >
          <div className="shrink-0 max-w-[28vw]">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.95vw] text-accent font-semibold mb-[0.4vh]">
              Whose store this is
            </div>
            <div className="font-display text-[1.5vw] leading-tight text-primary font-medium">
              The band runs the store. Headwaters delivers the software, the training, and the tools.
            </div>
          </div>
          <div className="font-body text-[1vw] text-text leading-[1.45] max-w-[52vw]">
            Hiring, scheduling, day-to-day decisions, ownership. Those belong to the band. Software, training, open-records tools, monthly visits. Those come from Headwaters. The shipping comes from the family-run cold truck. That truck already runs Thunder Bay to Sioux Lookout to Dryden every two weeks. <span className="text-primary font-semibold">Nobody flies in to run the store. Nobody needs to.</span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-5 gap-[1.2vw] min-h-0 mb-[2vh]">
          <div className="rounded-[0.4vw] p-[1.4vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[0.95vw] text-accent font-semibold mb-[1vh]">EVERYONE LEARNS EVERY JOB</div>
            <div className="font-display text-[1.4vw] leading-tight text-primary font-medium mb-[1vh]">
              Everyone can cover the store floor
            </div>
            <div className="font-body text-[0.95vw] text-muted leading-[1.45]">
              The till, the cooler, the stockroom, the daily books at a basic level. If two people do not show up on a Tuesday, the store still opens.
            </div>
          </div>

          <div className="rounded-[0.4vw] p-[1.4vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[0.95vw] text-accent font-semibold mb-[1vh]">LOCAL ON-CALL GROUP</div>
            <div className="font-display text-[1.4vw] leading-tight text-primary font-medium mb-[1vh]">
              Paid by the job, called in when needed
            </div>
            <div className="font-body text-[0.95vw] text-muted leading-[1.45]">
              A small group of community members called in for big restock days and market tables. The work goes to local people. No outside workers brought in. No one flown in to live here and run the store.
            </div>
          </div>

          <div className="rounded-[0.4vw] p-[1.4vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[0.95vw] text-accent font-semibold mb-[1vh]">SOFTWARE COVERS THE GAPS</div>
            <div className="font-display text-[1.4vw] leading-tight text-primary font-medium mb-[1vh]">
              The store keeps running when nobody is on the floor
            </div>
            <div className="font-body text-[0.95vw] text-muted leading-[1.45]">
              Reordering, closing the day, tracking shipments, daily books. The software does as much of this as it can. The till works without internet. The manager does not need to be in the building to know what is happening.
            </div>
          </div>

          <div className="rounded-[0.4vw] p-[1.4vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[0.95vw] text-accent font-semibold mb-[1vh]">SHIFTS GO TO WHO PICKS THEM UP</div>
            <div className="font-display text-[1.4vw] leading-tight text-primary font-medium mb-[1vh]">
              Open shifts go to whoever picks them up
            </div>
            <div className="font-body text-[0.95vw] text-muted leading-[1.45]">
              The board lists open shifts and what each shift pays. People pick up the ones that fit their week. Nobody is forced into a shift they could not make. The store does not stay closed waiting for someone.
            </div>
          </div>

          <div className="rounded-[0.4vw] p-[1.4vw] flex flex-col" style={{ background: "var(--slide-paper)" }}>
            <div className="font-mono text-[0.95vw] text-accent font-semibold mb-[1vh]">CALENDAR THAT BENDS</div>
            <div className="font-display text-[1.4vw] leading-tight text-primary font-medium mb-[1vh]">
              Built around community life
            </div>
            <div className="font-body text-[0.95vw] text-muted leading-[1.45]">
              Hunting season. Funerals. Hockey tournaments. Treaty days. The hours bend around community life. The store does not run on a southern work week.
            </div>
          </div>
        </div>

        <div
          className="rounded-[0.4vw] px-[1.6vw] py-[1.2vw] grid grid-cols-12 gap-[1.4vw] items-start"
          style={{ background: "var(--slide-primary)", color: "var(--slide-bg)" }}
        >
          <div className="col-span-3">
            <div className="font-mono uppercase tracking-[0.22em] text-[0.85vw] mb-[0.4vh]" style={{ color: "#e9c8a8" }}>
              The Headwaters team that delivers
            </div>
            <div className="font-display text-[1.25vw] leading-tight font-medium">
              On the ground often enough to stay close to the work. Not so often the band starts to need us.
            </div>
          </div>
          <div className="col-span-9 grid grid-cols-3 gap-x-[1.2vw] gap-y-[0.5vh] font-body text-[0.78vw] leading-[1.35] opacity-95">
            <div>
              <span className="font-semibold">Headwaters specialist.</span> Builds the software. Delivers the training. Visits Deer Lake every month.
            </div>
            <div>
              <span className="font-semibold">Dryden hub worker.</span> Based at our Dryden shop. Pay is part salary, part by the job. Handles the Deer Lake orders and the phone.
            </div>
            <div>
              <span className="font-semibold">Bookkeeper, part-time, remote.</span> Matches the records. Closes the month. Prepares payroll. Not on the store's payroll.
            </div>
            <div>
              <span className="font-semibold">A technical advisor we keep on call.</span> Reviews the software every three months. Checks any code that touches money before it goes live. Backup so the store does not depend on one person.
            </div>
            <div>
              <span className="font-semibold">Training partner.</span> An Indigenous educator. Runs three groups of trainees a year. Trains the trainers from the start.
            </div>
            <div>
              <span className="font-semibold">Local Deer Lake group.</span> Paid by the job for big days and market tables. The jobs stay local. Nobody is flown in to live here.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
