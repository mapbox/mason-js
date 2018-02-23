/*****************************************************************************
 *
 * This file is part of Mapnik (c++ mapping toolkit)
 *
 * Copyright (C) 2015 Artem Pavlenko
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 *
 *****************************************************************************/

#if defined(HAVE_CAIRO)

#ifndef MAPNIK_CAIRO_RENDER_VECTOR_HPP
#define MAPNIK_CAIRO_RENDER_VECTOR_HPP

// mapnik
#include <mapnik/svg/svg_path_adapter.hpp>

namespace agg { struct trans_affine; }

namespace mapnik {

class cairo_context;
struct pixel_position;
template <typename T> class box2d;
namespace svg { struct path_attributes; }

void render_vector_marker(cairo_context & context, svg::svg_path_adapter & svg_path,
                          agg::pod_bvector<svg::path_attributes> const & attributes,
                          box2d<double> const& bbox, agg::trans_affine const& tr,
                          double opacity);

}

#endif // MAPNIK_CAIRO_RENDER_VECTOR_HPP

#endif
