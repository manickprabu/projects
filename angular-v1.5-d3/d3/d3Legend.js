'use strict';

dashboardApp.service('D3Legend', function(){
    var legend;
    var chart;

    function create(_chart){
        chart = _chart;
        if(legend) {return;}

        chart.svg.selectAll('.legend').data([]).exit().remove();
        legend = chart.svg.append('g')
          .attr('class', 'legend')
          .attr('transform','translate(10,-30)')
          .attr('height', 100)
          .attr('width', 100);

        legend.selectAll('g')
            .data( chart.lines )
            .enter().append('g').each(function(d, i) {
                var g = d3.select(this);
                g.append('circle')
                  .attr('cx', 0)
                  .attr('cy', (i*17) - 4)
                  .attr('r', 6)
                  .style('fill', d.color);
                g.append('text')
                  .attr('x', 12)
                  .attr('y', (i*18))
                  .attr('height',30)
                  .attr('width',100)
                  .style('fill', d.color)
                  .text( d.name );

                g.on('click', function(event){
                    var selected = !d3.select(this).classed('selected');
                    d3.select(this).classed('selected',  selected);
                    event.toggle();
                });
            });
    } //end of legend

    function reset(){
        legend = null;
    }

    return {
        create  : create,
        reset   : reset
    };

});