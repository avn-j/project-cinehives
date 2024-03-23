export default async function AccordianTestDoNotImport() {
  return (
    <></>
    // <Accordion type="single" collapsible className="mt-8">
    //   <AccordionItem value="cast">
    //     <AccordionTrigger className="text-xl">Cast</AccordionTrigger>
    //     <AccordionContent>
    //       {castByCharacters.slice(0, 30).map((person: any) => {
    //         return (
    //           <TooltipProvider key={person.id}>
    //             <Tooltip delayDuration={1.5}>
    //               <TooltipTrigger>
    //                 <Badge
    //                   variant="outline"
    //                   className="m-1 text-stone-50"
    //                   key={person.id}
    //                 >
    //                   {person.name}
    //                 </Badge>
    //               </TooltipTrigger>
    //               <TooltipContent side="bottom" className="bg-accent">
    //                 <p className="text-xs" key={person.id}>
    //                   Starring as {person.characters.slice(0, 2).join(" / ")}
    //                   {person.characters.length > 2
    //                     ? ` and ${person.characters.length - 2} other roles.`
    //                     : ""}
    //                 </p>
    //               </TooltipContent>
    //             </Tooltip>
    //           </TooltipProvider>
    //         );
    //       })}
    //     </AccordionContent>
    //   </AccordionItem>
    //   <AccordionItem value="crew">
    //     <AccordionTrigger className="text-xl">Crew</AccordionTrigger>
    //     <AccordionContent>
    //       {crewDepartments.map((department, index) => {
    //         return (
    //           <div key={department}>
    //             <h3 className={index === 0 ? "mt-0" : "mt-5"}>{department}</h3>
    //             <Separator className="my-2 w-1/2 bg-stone-50" />
    //             {crewByDepartments[department].slice(0, 20).map((crew: any) => {
    //               return (
    //                 <TooltipProvider key={crew.id}>
    //                   <Tooltip delayDuration={1.5}>
    //                     <TooltipTrigger>
    //                       <Badge variant="outline" className="m-1 text-stone-50">
    //                         {crew.name}
    //                       </Badge>
    //                     </TooltipTrigger>
    //                     <TooltipContent side="bottom" className="bg-accent">
    //                       <p className="text-xs">
    //                         {crew.jobs[0].job}{" "}
    //                         {crew.jobs.length > 1
    //                           ? `and ${crew.jobs.length - 1} other ${crew.jobs.length - 1 === 1 ? "job" : "jobs"}`
    //                           : ""}
    //                       </p>
    //                     </TooltipContent>
    //                   </Tooltip>
    //                 </TooltipProvider>
    //               );
    //             })}
    //           </div>
    //         );
    //       })}
    //     </AccordionContent>
    //   </AccordionItem>
    // </Accordion>;
  );
}
